import React, { Component } from "react";
import PracticeCard from "./PracticeCard.jsx";

class Practice extends Component {
  constructor(props) {
    super(props);
    this.state = { words: [] };
  }

  componentDidMount = async () => {
    let data = new FormData();
    data.append("id", this.props.id);
    let response = await fetch("/getPractice", {
      method: "POST",
      credentials: "include",
      body: data
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      this.setState({ words: body.words.words });
    }
  };

  render() {
    console.log(this.state.words);

    return (
      <div className="practice-container">
        {this.state.words.map(word => {
          return <PracticeCard word={word} />;
        })}
      </div>
    );
  }
}

export default Practice;
