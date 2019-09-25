const express = require("express");
const app = express();
const reloadMagic = require("./reload-magic.js");
const multer = require("multer");
// const multerS3 = require("multer-s3");
// const aws = require("aws-sdk");

// aws.config.update({
//   secretAccessKey: "123455",
//   accessKeyId: "nirojan95",
//   region: "us-east-1"
// });

// s3 = new aws.S3();

// var upload = multer({ dest: __dirname + "uploads" });

var upload = multer();
// {
//   storage: multerS3({
//     s3: s3,
//     bucket: "bucket-name",
//     key: function(req, file, cb) {
//       console.log(file);
//       cb(null, file.originalname); //use Date.now() for unique file keys
//     }
//   })
// }

// const upload = multer({ dest: "/tmp" });
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const sha1 = require("sha1");
const testData = require("./data.js");

// Imports the Google Cloud client library
const textToSpeech = require("@google-cloud/text-to-speech");

// Import other required libraries
const fs = require("fs");
const util = require("util");

sessions = {};

let dbo = undefined;
let url =
  "mongodb+srv://chuckedup:JAbSNA29hPYv8na@cluster0-jxjpp.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  dbo = db.db("LearnFrench");
});

reloadMagic(app);

app.use(cookieParser());
app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets
app.use("/", express.static("data")); // Needed for audio

let generateid = () => {
  return Math.floor(Math.random() * 1000000000);
};

// Your endpoints go after this line
app.get("/", (req, res) => {
  res.send("Welcome to a basic express App");
});

app.get("/addData", (req, res) => {
  dbo.collection("data").insertOne(testData);
  res.send({ success: true });
});

app.post("/login", upload.none(), (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  dbo.collection("users").findOne({ username }, (err, user) => {
    if (err) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user.password === sha1(password)) {
      let sid = generateid();
      sessions[sid] = username;
      res.cookie("sid", sid);
      let cookies = req.cookies.sid;
      console.log(cookies);
      res.send(JSON.stringify({ success: true }));
      return;
    }
    res.send(JSON.stringify({ success: false }));
  });
});

app.get("/checkLogin", (req, res) => {
  console.log("in checkLogin");
  let sid = req.cookies.sid;
  let username = sessions[sid];
  if (username !== undefined) {
    res.send({ success: true, username });
    return;
  }
});

app.post("/signup", upload.none(), (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  dbo.collection("users").findOne({ username }, (err, user) => {
    if (err) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null) {
      dbo.collection("users").insertOne({ username, password: sha1(password) });
      res.send(JSON.stringify({ success: true }));
      return;
    }
    res.send(JSON.stringify({ success: false }));
  });
});

app.get("/getMenu", (req, res) => {
  let sid = req.cookies.sid;
  let username = sessions[sid];
  dbo
    .collection("data")
    .find({})
    .toArray((err, data) => {
      if (err) {
        console.log("err: ", err);
        return;
      }
      dbo.collection("users").findOne({ username }, (err, user) => {
        if (err) {
          console.log("err: ", err);
          return;
        }
        if (user !== null) {
          console.log(user);
          let levelsCompleted = user.levelsCompleted;
          res.send(JSON.stringify({ success: true, data, levelsCompleted }));
          return;
        }
        res.send(JSON.stringify({ success: true, data }));
      });
    });
});

app.post("/getPractice", upload.none(), (req, res) => {
  let id = req.body.id;
  dbo.collection("data").findOne({ _id: ObjectId(id) }, (err, item) => {
    if (err) {
      console.log("err: ", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    res.send(JSON.stringify({ success: true, words: item.words }));
  });
});

app.post("/getTest", upload.none(), (req, res) => {
  console.log("in getTest endpoint");
  let id = req.body.id;
  console.log(id);
  dbo.collection("data").findOne({ _id: ObjectId(id) }, (err, item) => {
    if (err) {
      console.log("err: ", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    res.send(JSON.stringify({ success: true, words: item.words }));
  });
});

app.get("/textToSpeech", (req, res) => {
  console.log("in /textToSpeech");
  dbo
    .collection("data")
    .find({})
    .toArray((err, items) => {
      if (err) {
        console.log("err", err);
        res.send(JSON.stringify({ success: false }));
        return;
      }

      let fWords = [];
      let eWords = [];
      let test = [];
      let f = [];
      let e = [];
      items.forEach(item => {
        item.words.forEach(word => {
          fWords = [word.fWord, ...fWords];
        });
      });
      items.forEach(item => {
        item.words.forEach(word => {
          eWords = [word.eWord, ...eWords];
        });
      });

      items.forEach(item => {
        item.words.forEach(word => {
          word.examples.forEach(example => {
            f = [example.f, ...f];
          });
        });
      });

      items.forEach(item => {
        item.words.forEach(word => {
          word.examples.forEach(example => {
            e = [example.e, ...e];
          });
        });
      });

      items.forEach(item => {
        item.words.forEach(word => {
          word.test.forEach(example => {
            test = [example, ...test];
          });
        });
      });

      console.log(fWords);
      console.log(eWords);
      console.log(e);
      console.log(f);
      console.log(test);

      eWords.forEach(async word => {
        // Creates a client
        const client = new textToSpeech.TextToSpeechClient();

        // Construct the request
        const request = {
          audioConfig: {
            audioEncoding: "LINEAR16",
            pitch: -0.4,
            speakingRate: 1.23
          },
          input: { text: word },
          // Select the language and SSML Voice Gender (optional)
          voice: {
            languageCode: "en-US",
            name: "en-US-Wavenet-D"
          },
          // Select the type of audio encoding
          audioConfig: { audioEncoding: "MP3" }
        };

        word = word.replace("?", "");

        // Performs the Text-to-Speech request
        const [response] = await client.synthesizeSpeech(request);
        fs.writeFileSync(`./data/eng-${word}.mp3`, response.audioContent);
      });

      fWords.forEach(async word => {
        // Creates a client
        const client = new textToSpeech.TextToSpeechClient();

        // Construct the request
        const request = {
          audioConfig: {
            audioEncoding: "LINEAR16",
            pitch: 1.6,
            speakingRate: 1.07
          },
          input: { text: word },
          // Select the language and SSML Voice Gender (optional)
          voice: {
            languageCode: "fr-FR",
            name: "fr-FR-Wavenet-A"
          },
          // Select the type of audio encoding
          audioConfig: { audioEncoding: "MP3" }
        };

        word = word.replace("?", "");

        // Performs the Text-to-Speech request
        const [response] = await client.synthesizeSpeech(request);
        fs.writeFileSync(`./data/${word}.mp3`, response.audioContent);
      });

      f.forEach(async word => {
        // Creates a client
        const client = new textToSpeech.TextToSpeechClient();

        // Construct the request
        const request = {
          audioConfig: {
            audioEncoding: "LINEAR16",
            pitch: 1.6,
            speakingRate: 1.07
          },
          input: { text: word },
          // Select the language and SSML Voice Gender (optional)
          voice: {
            languageCode: "fr-FR",
            name: "fr-FR-Wavenet-A"
          },
          // Select the type of audio encoding
          audioConfig: { audioEncoding: "MP3" }
        };

        word = word.replace("?", "");

        // Performs the Text-to-Speech request
        const [response] = await client.synthesizeSpeech(request);
        fs.writeFileSync(`./data/${word}.mp3`, response.audioContent);
      });

      test.forEach(async word => {
        // Creates a client
        const client = new textToSpeech.TextToSpeechClient();

        // Construct the request
        const request = {
          audioConfig: {
            audioEncoding: "LINEAR16",
            pitch: 1.6,
            speakingRate: 1.07
          },
          input: { text: word },
          // Select the language and SSML Voice Gender (optional)
          voice: {
            languageCode: "fr-FR",
            name: "fr-FR-Wavenet-A"
          },
          // Select the type of audio encoding
          audioConfig: { audioEncoding: "MP3" }
        };

        word = word.replace("?", "");

        // Performs the Text-to-Speech request
        const [response] = await client.synthesizeSpeech(request);
        fs.writeFileSync(`./data/${word}.mp3`, response.audioContent);
      });

      res.send(JSON.stringify({ success: true }));
    });
});

app.get("/logout", (req, res) => {
  let sid = req.cookies.sid;
  delete sessions[sid];
  res.send(JSON.stringify({ success: true }));
});

app.post("/updateUserInfo", upload.none(), (req, res) => {
  let sid = req.cookies.sid;
  let username = sessions[sid];
  let id = req.body.id;
  dbo
    .collection("users")
    .updateOne(
      { username },
      { $addToSet: { levelsCompleted: id } },
      (err, item) => {
        if (err) {
          console.log("err: ", err);
          return;
        }
        res.send(JSON.stringify({ success: true }));
      }
    );
});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
