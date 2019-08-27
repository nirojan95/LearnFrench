import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, BrowserRouter, Link } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Menu from "./Menu.jsx";
import Practice from "./Practice.jsx";

class UnconnectedApp extends Component {
  renderHomepage = () => {
    return (
      <div>
        <Link to="/login">Login</Link>
      </div>
    );
  };

  renderLogin = () => {
    return <Login />;
  };

  renderSignup = () => {
    return <Signup />;
  };

  renderMenu = () => {
    return <Menu />;
  };

  renderPractice = routerData => {
    let practiceId = routerData.match.params.pid;
    return (
      <div>
        <Practice id={practiceId} />
      </div>
    );
  };

  render = () => {
    return (
      <BrowserRouter>
        <Route exact={true} path="/" component={this.renderHomepage} />
        <Route exact={true} path="/login" component={this.renderLogin} />
        <Route exact={true} path="/signup" component={this.renderSignup} />
        <Route exact={true} path="/menu" component={this.renderMenu} />
        <Route
          exact={true}
          path="/practice/:pid"
          component={this.renderPractice}
        />
      </BrowserRouter>
    );
  };
}

let App = connect()(UnconnectedApp);

export default App;
