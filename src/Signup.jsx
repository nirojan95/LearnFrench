import React, { Component } from "react";
import { Link } from "react-router-dom";
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
    let response = await fetch("/signup", {
      method: "POST",
      credentials: "include",
      body: data
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (!body.success) {
      alert("Not a valid username");
    }
  };
  render() {
    return (
      <div class="signup-container">
        <div class="signup-center">
          <div class="signupText">Sign Up</div>
          <form onSubmit={this.submitHandler}>
            <div>
              <input
                class="textbox"
                type="text"
                onChange={this.nameChangeHandler}
                placeholder="Name"
                required
              />
            </div>
            <div>
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
            <input
              className="signup-button"
              type="submit"
              value="Create Account"
            />
          </form>
          <div>
            <Link className="login-link" to="/login">
              Already have an Account? Sign in!
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

let Signup = connect()(UnconnectedSignup);

export default Signup;
