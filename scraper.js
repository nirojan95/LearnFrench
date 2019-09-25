const puppeteer = require("puppeteer");
const MongoClient = require("mongodb").MongoClient;
let CREDS = require("./cred.js");
// const Apify = require("apify");
// const url = process.argv[2];
// use above so you can enter "node scraper.js url" into the terminal

let dbo = undefined;
let url =
  "mongodb+srv://chuckedup:JAbSNA29hPYv8na@cluster0-jxjpp.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  dbo = db.db("LearnFrench");
});

let delay = interval => new Promise(res => setTimeout(res, interval));
async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720 });
  await page.goto(
    "https://www.frenchpod101.com/lesson/business-french-for-beginners-3-describing-your-profession-in-french/?lp=151",
    { waitUntil: "networkidle0" }
  );

  await page.mouse.click(0, 0);
  await page.hover("div.dashbar-a__block--sign-in.js-dashbar-a-nav");

  await page.waitFor("form#header_signing input[type=text]");
  await delay(2000);
  console.log("first delay done");

  console.log("second delay done");
  await page.type("input[name='amember_login']", CREDS.username);
  await page.type("form#header_signing input[type=password]", CREDS.password);

  await Promise.all([
    page.click(".r101-button-30--f"),
    page.waitForNavigation({ waitUntil: "networkidle0" })
  ]);
  await delay(2000);

  const frenchWords = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        "span[lang='fr']:not(.lsn3-lesson-vocabulary__term)"
      )
    ).map(word => word.innerText)
  );

  const englishWords = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".lsn3-lesson-vocabulary__definition"))
      .map(word => word.innerText)
      .filter(word => !word.includes("."))
      .filter(word => !word.includes("?"))
      .filter(word => !word.includes("!"))
  );

  let data = [];
  console.log("before french Examples");
  let frenchExamples = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll("span.lsn3-lesson-vocabulary__term table")
    ).map(table =>
      Array.from(table.querySelectorAll("span[lang='fr']")).map(
        word => word.innerText
      )
    )
  );

  let englishExamples = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll("span.lsn3-lesson-vocabulary__term table")
    ).map(table =>
      Array.from(
        table.querySelectorAll("span.lsn3-lesson-vocabulary__definition")
      ).map(word => word.innerText)
    )
  );
  // #lsn3
  for (i = 0; i < frenchWords.length; i++) {
    let fWord = frenchWords[i];
    let eWord = englishWords[i];
    // let f = await page.evaluate(() =>
    //   Array.from(
    //     document.querySelectorAll("span.lsn3-lesson-vocabulary__term table")
    //   ).map(table =>
    //     Array.from(table.querySelectorAll("span[lang='fr']")).map(
    //       word => word.innerText
    //     )
    //   )
    // );
    let examples = [];
    for (j = 0; j < frenchExamples[i].length; j++) {
      examples = [
        { f: frenchExamples[i][j], e: englishExamples[i][j] },
        ...examples
      ];
    }

    // let examples = { f: frenchExamples[i], e: englishExamples[i] };
    let word = { fWord, eWord, examples };
    data = [word, ...data];
  }
  data = data.reverse();
  data = { words: data };

  //   console.log(englishExamples);
  //   console.log(frenchExamples);
  //   console.log(frenchWords);
  //   console.log(englishWords);
  console.log(data);
  //   dbo.collection("data").insertOne(data);
}
// async function main() {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.setViewport({ width: 1200, height: 720 });
//   await page.goto("https://www.facebook.com", { waitUntil: "networkidle0" }); // wait until page load
//   await page.type("input#email", CREDS.username);
//   await page.type("input#pass", CREDS.password);
//   // click and wait for navigation
//   await Promise.all([
//     page.click("form#login_form input[type=submit]"),
//     page.waitForNavigation({ waitUntil: "networkidle0" })
//   ]);
// }
main();

// https://www.frenchpod101.com/lesson/business-french-for-beginners-1-introducing-yourself-in-a-business-meeting/?lp=151
// https://www.frenchpod101.com/lesson/business-french-for-beginners-2-introducing-your-new-colleague/?lp=151
// https://www.frenchpod101.com/lesson/business-french-for-beginners-3-describing-your-profession-in-french/?lp=151
