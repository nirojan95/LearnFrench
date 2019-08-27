import React, { Component } from "react";
import Examples from "./Examples.jsx";
import "./practiceCard.css";

class PracticeCard extends Component {
  constructor(props) {
    super(props);
    this.state = { isHidden: true };
  }
  toggleHidden = () => {
    this.setState({ isHidden: !this.state.isHidden });
  };

  render() {
    return (
      <div className="flex flex-horizontal-center">
        <div className="flex-grid border-bottem padding-bottom">
          <div className="col text-center">
            <i class="fas fa-volume-up" />
          </div>
          <div className="col">
            <div>{this.props.word.fWord}</div>
            <div className="eng-word">{this.props.word.eWord}</div>
          </div>
          <div className="col">
            <button onClick={this.toggleHidden.bind(this)}>Examples</button>
          </div>
        </div>
        {!this.state.isHidden && (
          <Examples examples={this.props.word.examples} />
        )}
      </div>
    );
  }
}

export default PracticeCard;
