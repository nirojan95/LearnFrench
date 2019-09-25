import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

let counter = 0;

class UnconnectedTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: undefined,
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
      userResponse: undefined,
      borderColor: 0
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
      this.setState({ test, _id: this.props.id });
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
      if (
        this.state.engWord === "Level Complete! Press Space to return to Menu."
      ) {
        this.props.history.push("/menu");
        return;
      }
      this.setState({ createGameArray: true, borderColor: 0 });
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
          currentWordIndex: this.state.currentWordIndex + 1,
          borderColor: 1
        });
        this.cancel();
        await this.delay(1000, false);
        this.setState({ borderColor: 0 });
        this.nextWord();
      } else {
        this.setState({ lost: true, borderColor: 2 });
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
          currentWordIndex: this.state.currentWordIndex + 1,
          borderColor: 1
        });
        this.cancel();
        await this.delay(1000, false);
        this.setState({ borderColor: 0 });
        this.nextWord();
      } else {
        this.setState({ lost: true, borderColor: 2 });
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
  };

  startGame = () => {
    console.log("in start game");
    this.delay(500, false);
    this.nextWord();
  };

  borderColor = () => {
    if (this.state.borderColor === 0) {
      return "border";
    }
    if (this.state.borderColor === 1) {
      return "border-green";
    }
    if (this.state.borderColor === 2) {
      return "border-red";
    }
  };

  updateUserInfo = async () => {
    console.log(this.state._id);
    let data = new FormData();
    data.append("id", this.state._id);
    let response = await fetch("/updateUserInfo", {
      method: "POST",
      credentials: "include",
      body: data
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      console.log("Level Complete");
      this.setState({
        won: false,
        inSession: false,
        engWord: "Level Complete! Press Space to return to Menu."
      });
    }
  };

  render() {
    if (this.state.createGameArray) {
      this.createGame();
      this.setState({ startGame: true });
    }

    if (this.state.startGame) {
      this.setState({ startGame: false, inSession: true });
      this.startGame();
    }

    if (this.state.lost) {
      this.cancel();
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
        userResponse: undefined,
        borderColor: 2
      });
      this.preGame();
    }

    if (this.state.won) {
      this.updateUserInfo();
    }

    return (
      <div className="practice-container flex-horizontal-center">
        <div
          className={` height-500 practice-container padding-top-bottom margin-top-50 overflow-visible ${this.borderColor()}`}
        >
          <div className="col padding-bottom-100">
            <div>{this.state.engWord}</div>
          </div>
          <div className="col padding">
            <div className="font-color-grey">
              Press F key for correct word and J key for incorrect word within 2
              seconds.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

let Test = connect()(withRouter(UnconnectedTest));

export default Test;
