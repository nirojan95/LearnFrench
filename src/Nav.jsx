import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "./nav.css";

class UnconnectedNav extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }
  logoutHandler = () => {
    this.props.dispatch({ type: "logout" });
    fetch("/logout");
    this.props.history.push("/");
  };

  toggleMenu = () => {
    this.setState({ active: !this.state.active });
  };

  render() {
    return (
      <nav>
        <ul className="menu">
          <li className="logo">
            <Link to="/">Learn French</Link>
          </li>
          {this.props.loginStatus ? (
            <span className="sign-up-flex">
              <li className={this.state.active ? "item active" : "item"}>
                <Link to="/">Home</Link>
              </li>
              <li className={this.state.active ? "item active" : "item"}>
                <Link to="/menu">Menu</Link>
              </li>
              <li className={this.state.active ? "item active" : "item"}>
                <Link to="/about">About</Link>
              </li>
              <li
                className={
                  this.state.active ? "item button active" : "item button"
                }
              >
                <span onClick={this.logoutHandler}>
                  <a>Logout</a>
                </span>
              </li>
            </span>
          ) : (
            <span className="sign-up-flex">
              <li className={this.state.active ? "item active" : "item"}>
                <Link to="/">Home</Link>
              </li>
              <li className={this.state.active ? "item active" : "item"}>
                <Link to="/about">About</Link>
              </li>
              <li
                className={
                  this.state.active ? "item button active" : "item button"
                }
              >
                <Link to="/">Signin</Link>
              </li>
            </span>
          )}
          <li className="toggle">
            <span onClick={this.toggleMenu}>
              <i class="fas fa-bars"></i>
            </span>
          </li>
        </ul>
      </nav>
    );
  }
}

let mapStateToProps = state => {
  return { loginStatus: state.loginStatus };
};

let Nav = connect(mapStateToProps)(withRouter(UnconnectedNav));

export default Nav;
