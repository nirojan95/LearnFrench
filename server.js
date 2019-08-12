import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, BrowserRouter, Link } from "react-router-dom";

class UnconnectedApp extends Component {
  renderHomepage = () => {
    return (
      <div>
        <Link to={"/login"}>Purchase History</Link>
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
