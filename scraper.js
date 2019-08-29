const cheerio = require("cheerio");
const axios = require("axios");

axios
  .get(
    "https://www.frenchpod101.com/lesson/business-french-for-beginners-1-introducing-yourself-in-a-business-meeting/?lp=151"
  )
  .then(response => {
    // Load the web page source code into a cheerio instance
    const $ = cheerio.load(response.data);

    // The pre.highlight.shell CSS selector matches all `pre` elements
    // that have both the `highlight` and `shell` class
    const urlElems = $("pre.highlight.shell");

    // We now loop through all the elements found
    for (let i = 0; i < urlElems.length; i++) {
      // Since the URL is within the span element, we can use the find method
      // To get all span elements with the `s1` class that are contained inside the
      // pre element. We select the first such element we find (since we have seen that the first span
      // element contains the URL)
      const urlSpan = $(urlElems[i]).find("span[lang=fr]")[0];

      // We proceed, only if the element exists
      if (urlSpan) {
        // We wrap the span in `$` to create another cheerio instance of only the span
        // and use the `text` method to get only the text (ignoring the HTML)
        // of the span element
        const urlText = $(urlSpan).text();

        // We then print the text on to the console
        console.log(urlText);
      }
    }
  });
