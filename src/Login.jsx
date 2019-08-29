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
    return (
      <div class="login-container">
        <div class="login-center">
          <div class="signin-text">Sign in</div>
          <form onSubmit={this.submitHandler}>
            <div>
              {" "}
              <input
                class="textbox"
                type="text"
                onChange={this.usernameChangeHandler}
                placeholder="Username"
                required
              />
            </div>
            <div>
              <input
                class="textbox"
                type="text"
                onChange={this.passwordChangeHandler}
                placeholder="Password"
                required
              />
            </div>
            <input type="submit" value="Login" />
          </form>
          <div>
            <Link to="/signup">Create An Account</Link>
          </div>
        </div>
      </div>
    );
  }
}

let Login = connect()(UnconnectedLogin);

export default Login;
