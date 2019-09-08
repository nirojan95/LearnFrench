import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "./menu.css";

class UnconnectedMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { levels: undefined, levelsCompleted: [] };
  }

  componentDidMount = async () => {
    let response = await fetch("/getMenu");
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    console.log(body);
    console.log(body);
    if (body.success) {
      this.setState({
        levels: body.data,
        levelsCompleted: body.levelsCompleted
      });
    }
  };

  levelHandler = level => {
    this.props.dispatch({ type: "current-level", level });
    this.props.history.push(`/practice/${level._id}`);
  };

  showFinishedLevels = level => {
    console.log(level.id_);
    console.log(this.state.levelsCompleted);
    if (!this.state.levelsCompleted.includes(level._id)) return "circle";
    if (this.state.levelsCompleted.includes(level._id))
      return "circle-completed";
  };

  render() {
    console.log(this.state.levelsCompleted);
    if (this.state.levels === undefined) {
      return <div>Loading...</div>;
    }
    return (
      <div className="practice-container">
        <div className="flex  border width-30">
          {this.state.levels.map(level => {
            return (
              <span
                onClick={() => this.levelHandler(level)}
                className={this.showFinishedLevels(level)}
              >
                {level.id}
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}

let Menu = connect()(withRouter(UnconnectedMenu));

export default Menu;
