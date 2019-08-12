import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, BrowserRouter, Link } from "react-router-dom";
import Login from "./Login.jsx";

class UnconnectedApp extends Component {
  renderHomepage = () => {
    return (
      <div>
        <Link to={"/login"}>Login</Link>
      </div>
    );
  };

  renderLogin = () => {
    return <Login />;
  };

  render = () => {
    return (
      <BrowserRouter>
        <Route exact={true} path="/" component={this.renderHomepage} />
        <Route exact={true} path="/login" component={this.renderLogin} />
      </BrowserRouter>
    );
  };
}

let App = connect()(UnconnectedApp);

export default App;
