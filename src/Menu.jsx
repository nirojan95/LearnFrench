import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "./menu.css";

class UnconnectedMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { levels: undefined };
  }

  componentDidMount = async () => {
    let response = await fetch("/menu");
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    console.log(body);
    if (body.success) {
      this.setState({ levels: body.data });
    }
  };

  levelHandler = level => {
    this.props.dispatch({ type: "current-level", level });
    this.props.history.push(`/practice/${level._id}`);
  };

  render() {
    console.log(this.state.levels);
    if (this.state.levels === undefined) {
      return <div>Loading...</div>;
    }
    return (
      <div className="border practice-container">
        <div className="flex  border">
          {this.state.levels.map(level => {
            return (
              <span onClick={() => this.levelHandler(level)} className="circle">
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
