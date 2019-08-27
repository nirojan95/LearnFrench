const express = require("express");
const app = express();
const reloadMagic = require("./reload-magic.js");
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/" });
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const sha1 = require("sha1");

// Imports the Google Cloud client library
const textToSpeech = require("@google-cloud/text-to-speech");

// Import other required libraries
const fs = require("fs");
const util = require("util");

sessions = {};
let practice = {
  id: 1,
  words: [
    {
      fWord: "vraiment",
      eWord: "really",
      examples: [
        { f: "Il a vraiment dit ça?", e: "He really said that?" },
        {
          f:
            "Nous sommes vraiment désolé(e)s mais nous ne pouvons pas sortir ce soir.",
          e: "We are really sorry, but you cannot go out tonight."
        },
        { f: "J'aime vraiment ce film!", e: "I really like this movie!" },
        { f: "Je suis vraiment seul.", e: "I am really lonely." }
      ]
    },
    {
      fWord: "seul",
      eWord: "alone, sole, single, lonely, only",
      examples: [{ f: "Tu es seul.", e: "You are alone." }]
    },
    {
      fWord: "fille",
      eWord: "girl, daughter",
      examples: [
        { f: "J'ai deux filles.", e: "I have two daughters." },
        {
          f:
            "Sa fille aide à l'organisation de la réunion, donc vous devriez mettre une chaise supplémentaire.",
          e:
            "His daughter is assisting with the reunion's organization, so you should set an extra seat."
        },
        {
          f: "Comme toi, la fille est seule",
          e: "Like you, the girl is alone."
        }
      ]
    },
    {
      fWord: "devant",
      eWord: "in front, ahead",
      examples: [
        { f: "Jacques est devant moi.", e: "Jacques is in front of me." }
      ]
    }
  ]
};
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
app.get("/addData", (req, res) => {
  dbo.collection("practice").insertOne(practice);
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
      res.send(JSON.stringify({ success: true }));
      return;
    }
    res.send(JSON.stringify({ success: false }));
  });
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

app.post("/getPractice", upload.none(), (req, res) => {
  let id = Number(req.body.id);
  dbo.collection("practice").findOne({ id }, (err, words) => {
    if (err) {
      console.log("err: ", err);
      return;
    }
    res.send(JSON.stringify({ success: true, words }));
  });
});

app.post("/textToSpeech", upload.none(), (req, res) => {
  dbo
    .collection("practice")
    .find({})
    .toArray((err, items) => {
      if (err) {
        console.log("err", err);
        return;
      }

      let fWords = [];

      items.forEach(item => {
        item.words.forEach(word => {
          fWords = [word.fWord, ...fWords];
        });
      });

      console.log(fWords);

      fWords.forEach(async word => {
        // Creates a client
        const client = new textToSpeech.TextToSpeechClient();

        // Construct the request
        const request = {
          input: { text: word },
          // Select the language and SSML Voice Gender (optional)
          voice: { languageCode: "fr-CA", ssmlGender: "NEUTRAL" },
          // Select the type of audio encoding
          audioConfig: { audioEncoding: "MP3" }
        };

        // Performs the Text-to-Speech request
        const [response] = await client.synthesizeSpeech(request);
        fs.writeFileSync(`./data/${word}.mp3`, response.audioContent);
      });
    });
});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
