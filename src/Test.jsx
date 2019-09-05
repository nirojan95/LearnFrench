import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

let timer;
let counter = 0;

class UnconnectedTest extends Component {
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
      engWord: "Press Space to Start.",
      gameLength: 0,
      currentWordIndex: 0,
      inSession: false,
      wonRound: false,
      userResponse: undefined
    };
  }
  componentDidMount = () => {
    this.preGame();
  };

  preGame = async () => {
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

  handleKeyPress = async e => {
    this.setState({ currentKey: e.keyCode });
    if (e.keyCode === 32 && !this.state.inSession) {
      if (this.state.won) {
        this.props.history.push("/menu");
        return;
      }
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
        this.cancel();
        // clearTimeout(timer);
        // setTimeout(this.nextWord, 1000);
        await this.delay(1000, false);
        this.nextWord();
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
        // clearTimeout(timer);
        // setTimeout(this.nextWord, 1000);
        this.cancel();
        await this.delay(1000, false);
        this.nextWord();
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

  nextWord = async () => {
    this.setState({ wonRound: false });
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
    await this.delay(1250, false);
    this.soundHandler(this.state.gameArray[this.state.currentWordIndex].fr);
    await this.delay(3000, true);
    if (this.state.wonRound) {
      this.setState({ wonRound: false });
      console.log("roundWon");
    } else {
      this.setState({ lost: true });
    }
    // setTimeout(() => {
    //   this.soundHandler(this.state.gameArray[this.state.currentWordIndex].fr);
    //   timer = setTimeout(() => {
    //     if (this.state.wonRound) {
    //       this.setState({ wonRound: false });
    //       console.log("roundWon");
    //     } else {
    //       this.setState({ lost: true });
    //     }
    //   }, 5000);
    // }, 1250);
  };

  startGame = () => {
    console.log("in start game");
    this.delay(500, false);
    this.nextWord();
    // setTimeout(this.nextWord, 500);
  };

  render() {
    console.log("won: ", this.state.won);
    console.log("test: ", this.state.test);
    // console.log("current key: ", this.state.currentKey);
    // console.log("createGameArray: ", this.state.createGameArray);
    console.log("gameLength: ", this.state.gameLength);
    console.log("currentWordIndex: ", this.state.currentWordIndex);
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
        engWord: "Press space to restart game!",
        test: [],
        gameArray: [],
        createGameArray: false,
        startGame: false,
        currentKey: "none pressed yet",
        won: false,
        gameLength: 0,
        currentWordIndex: 0,
        wonRound: false,
        userResponse: undefined
      });
      this.preGame();
    }

    if (this.state.won) {
      this.setState({
        inSession: false,
        engWord: "Level Complete! Press Space to return to Menu."
      });
    }

    return (
      <div className="border practice-container flex-horizontal-center">
        <div className="border practice-container padding-top-bottom margin-top-10">
          <div className="col border padding">
            <div>{this.state.engWord}</div>
          </div>
          <div className="col border padding">
            <div>
              Press F key for correct word and J key for incorrect word.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

let Test = connect()(withRouter(UnconnectedTest));

export default Test;
