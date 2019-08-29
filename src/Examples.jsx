import React, { Component } from "react";

class Examples extends Component {
  constructor(props) {
    super(props);
    this.state = { examples: this.props.examples };
  }

  soundHandler = example => {
    let audio = new Audio(`/${example}.mp3`);
    console.log(audio);
    audio.play();
  };

  render() {
    return (
      <div className="padding-10 margin-top-10">
        {this.props.examples.map(example => {
          return (
            <div className="padding-10">
              <div className="flex-grid">
                <div className="col text-center">
                  <span
                    onClick={() =>
                      this.soundHandler(example.f.replace("?", ""))
                    }
                  >
                    <i class="fas fa-volume-up" />
                  </span>
                </div>
                <div className="col">
                  <div>{example.f}</div>
                  <div className="eng-word">{example.e}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Examples;
