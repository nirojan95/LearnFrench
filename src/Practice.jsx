import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PracticeCard from "./PracticeCard.jsx";

class UnconnectedPractice extends Component {
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
      this.setState({ words: body.words });
    }
  };

  render() {
    console.log(this.props.level);

    return (
      <div className="practice-container">
        {this.state.words.map(word => {
          return <PracticeCard word={word} />;
        })}
        <Link to={`/test/${this.props.level._id}`}>Test Your Skills</Link>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return { level: state.level };
};

let Practice = connect(mapStateToProps)(withRouter(UnconnectedPractice));

export default Practice;
