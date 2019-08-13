import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedSignup extends Component {
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
    }
  };
  render() {
    return (
      <div class="login-container">
        <div class="login-center">
          <div class="signup-text">Sign Up</div>
          <form onSubmit={this.submitHandler}>
            <div>
              {" "}
              <input
                class="textbox"
                type="text"
                onChange={this.nameChangeHandler}
                placeholder="Name"
                required
              />
            </div>
            <div>
              {" "}
              <input
                class="textbox"
                type="text"
                onChange={this.usernameChangeHandler}
                placeholder="Email"
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
            <input type="submit" value="Create Account" />
          </form>
        </div>
      </div>
    );
  }
}

let Signup = connect()(UnconnectedSignup);

export default Signup;
