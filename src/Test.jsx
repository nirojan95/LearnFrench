import React, { Component } from "react";

let timer;
let counter = 0;

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: [],
      gameArray: [],
      createGameArray: false,
      startGame: false,
      currentKey: "none pressed yet",
      won: false,
      lost: false,
      engWord: "Welcome to the Game",
      gameLength: 0,
      currentWordIndex: 0,
      inSession: false,
      wonRound: false,
      userResponse: undefined
    };
  }
  componentDidMount = async () => {
    let data = new FormData();
    data.append("id", this.props.id);
    let response = await fetch("/getTest", {
      method: "POST",
      credentials: "include",
      body: data
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      let test = [];
      body.words.forEach(word => {
        test = [
          { fr: word.fWord, fakeWords: word.test, eng: word.eWord },
          ...test
        ];
      });
      this.setState({ test });
      document.addEventListener("keydown", this.handleKeyPress);
    }
  };

  delay = (interval, cancellable) => {
    let current = counter;
    return new Promise((res, rej) => {
      let f = () => {
        if (cancellable && current !== counter) rej();
        else res();
      };
      setTimeout(f, interval);
    });
  };
  cancel = () => {
    counter++;
  };

  handleKeyPress = e => {
    this.setState({ currentKey: e.keyCode });
    if (e.keyCode === 27) {
      console.log("You just pressed Escape!");
    }
    if (e.keyCode === 32 && !this.state.inSession) {
      this.setState({ createGameArray: true });
    }
    if (e.keyCode === 70 && this.state.inSession) {
      console.log("in f key");
      this.setState({ userResponse: true });
      console.log(
        this.state.gameArray[this.state.currentWordIndex].boolean,
        this.state.userResponse
      );
      if (
        this.state.gameArray[this.state.currentWordIndex].boolean ===
        this.state.userResponse
      ) {
        this.setState({
          userResponse: undefined,
          wonRound: true,
          currentWordIndex: this.state.currentWordIndex + 1
        });
        clearTimeout(timer);
        setTimeout(this.nextWord, 1000);
      } else {
        this.setState({ lost: true });
      }
    }
    if (e.keyCode === 74 && this.state.inSession) {
      this.setState({ userResponse: false });
      if (
        this.state.gameArray[this.state.currentWordIndex].boolean ===
        this.state.userResponse
      ) {
        this.setState({
          userResponse: undefined,
          wonRound: true,
          currentWordIndex: this.state.currentWordIndex + 1
        });
        clearTimeout(timer);
        setTimeout(this.nextWord, 1000);
      } else {
        this.setState({ lost: true });
      }
    }
  };

  soundHandler = (example, lang) => {
    let audio = undefined;
    if (lang === "eng") {
      audio = new Audio(`/eng-${example}.mp3`);
    } else {
      audio = new Audio(`/${example}.mp3`);
    }
    console.log(audio);
    audio.play();
  };

  createGame = () => {
    let gameArray = [];
    let correctWords = [];
    this.state.test.forEach(word => {
      let randNum = Math.round(Math.random());
      if (randNum === 0) {
        let fakeWord =
          word.fakeWords[Math.floor(Math.random() * word.fakeWords.length)];
        gameArray = [
          { eng: word.eng, fr: fakeWord, boolean: false },
          ...gameArray
        ];
        correctWords.push({ eng: word.eng, fr: word.fr, boolean: true });
      }
      if (randNum === 1) {
        gameArray = [
          { eng: word.eng, fr: word.fr, boolean: true },
          ...gameArray
        ];
      }
    });
    gameArray = gameArray.concat(correctWords.reverse());
    this.setState({
      gameArray,
      createGameArray: false,
      gameLength: gameArray.length
    });
  };

  nextWord = () => {
    if (this.state.currentWordIndex === this.state.gameLength) {
      this.setState({ won: true });
      return;
    }
    this.setState({
      engWord: this.state.gameArray[this.state.currentWordIndex].eng
    });
    this.soundHandler(
      this.state.gameArray[this.state.currentWordIndex].eng,
      "eng"
    );
    setTimeout(() => {
      this.soundHandler(this.state.gameArray[this.state.currentWordIndex].fr);
      timer = setTimeout(() => {
        if (this.state.wonRound) {
          this.setState({ wonRound: false });
          console.log("roundWon");
        } else {
          this.setState({ lost: true });
        }
      }, 5000);
    }, 1250);
  };

  startGame = () => {
    console.log("in start game");
    setTimeout(this.nextWord, 500);
  };

  render() {
    console.log(this.state.won);
    // console.log(this.state.test);
    // console.log("current key: ", this.state.currentKey);
    // console.log("createGameArray: ", this.state.createGameArray);
    console.log(this.state.gameLength);
    console.log(this.state.currentWordIndex);
    console.log("gameArray: ", this.state.gameArray);
    if (this.state.createGameArray) {
      this.createGame();
      this.setState({ startGame: true });
    }

    if (this.state.startGame) {
      this.setState({ startGame: false, inSession: true });
      this.startGame();
    }

    if (this.state.lost) {
      alert("game lost");
      this.setState({
        lost: false,
        inSession: false,
        engWord: "Press space to restart game!"
      });
    }

    if (this.state.won) {
      alert("Chapter Complete");
      this.setState({
        won: false,
        inSession: false,
        engWord: "Level Complete"
      });
    }

    return (
      <div className="border practice-container">
        <div className="col border padding">
          <div>{this.state.engWord}</div>
        </div>
        <div className="col border padding">
          <div>Press F key for correct word and J key for incorrect word.</div>
        </div>
      </div>
    );
  }
}

export default Test;
