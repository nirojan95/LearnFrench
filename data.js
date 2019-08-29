let testData = {
  id: 1,
  words: [
    {
      fWord: "vraiment",
      eWord: "really",
      test: ["vrai", "vranant", "voulant", "tellement", "vingtment"],
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
      test: ["stool", "solé", "suélent", "seulaire"],
      examples: [{ f: "Tu es seul.", e: "You are alone." }]
    },
    {
      fWord: "fille",
      eWord: "girl, daughter",
      test: ["fil", "feels", "fils", "falls", "femme", "file"],
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
      test: ["devoir", "devin", "devenir", "avant", "vent"],
      examples: [
        { f: "Jacques est devant moi.", e: "Jacques is in front of me." }
      ]
    }
  ]
};

module.exports = testData;
