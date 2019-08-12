import React, { Component } from "react";

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
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <input type="text" onChange={this.usernameChangeHandler} />
          <input type="text" onChange={this.passwordChangeHandler} />
          <input type="submit" value="Login" />
        </form>
      </div>
    );
  }
}

let Login = connect()(UnconnectedLogin);

export default Login;
