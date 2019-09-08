import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./main.css";

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { password: "", username: "" };
  }

  usernameChangeHandler = e => {
    this.setState({ username: e.target.value });
  };

  passowrdChangeHandler = e => {
    this.setState({ password: e.target.value });
  };

  submitHandler = async e => {
    e.preventDefault();
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    let response = await fetch("/login", {
      method: "POST",
      credentials: "include",
      body: data
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (!body.success) {
      alert("Not a valid Login!");
      return;
    }
    this.props.dispatch({
      type: "login-success",
      username: this.state.username
    });
    this.props.history.push("/");
  };

  render() {
    if (this.props.loginStatus) {
      return (
        <div className="login-container logged-in flex-justify-right">
          <div className="flex-column display-flex">
            <div className="margin-right margin-top-420">
              {" "}
              Welcome {this.props.username}!
            </div>
            <div
              className="menu-button border margin-right"
              onClick={() => {
                this.props.history.push("/menu");
              }}
            >
              Menu
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="login-container ">
          <form onSubmit={this.submitHandler}>
            <div className="login-center">
              <div>
                <input
                  className="textbox"
                  type="text"
                  onChange={this.usernameChangeHandler}
                  placeholder="Username"
                  required
                />
              </div>
              <div>
                <input
                  className="textbox"
                  type="password"
                  onChange={this.passwordChangeHandler}
                  placeholder="Password"
                  required
                />
              </div>
              <input className="submit-login" type="submit" value="Login" />
            </div>
          </form>
        </div>
      );
    }
  }
}

let mapStateToProps = state => {
  return { loginStatus: state.loginStatus, username: state.username };
};

let Login = connect(mapStateToProps)(UnconnectedLogin);

export default Login;
