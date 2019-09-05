import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, BrowserRouter, Link } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Menu from "./Menu.jsx";
import Practice from "./Practice.jsx";
import Test from "./Test.jsx";
import Nav from "./Nav.jsx";

class UnconnectedApp extends Component {
  renderHomepage = props => {
    return (
      <div>
        {/* <Nav></Nav> */}
        <div className="flex-horizontal-center display-flex">
          <div className=" display-flex margin-top-10 width-90  border-bold z-index-1 postion-relative">
            <h1>Learn French</h1>
            <span className="signup-text-home">
              <span
                className="signup-btn"
                onClick={() => {
                  props.history.push("/signup");
                }}
              >
                Signup
              </span>{" "}
              and Start Learning Today!
            </span>
            <span>
              <Login history={props.history} />
            </span>
            <img
              className="opacity height-800 z-index-2"
              src="/painting.jpg"
              width="100%"
            ></img>
          </div>
        </div>
      </div>
    );
  };

  renderLogin = props => {
    return <Login history={props.history} />;
  };

  renderSignup = () => {
    return <Signup />;
  };

  renderMenu = () => {
    return (
      <div>
        <Nav />
        <Menu />
      </div>
    );
  };

  renderPractice = routerData => {
    let practiceId = routerData.match.params.pid;
    return (
      <div>
        <Nav />
        <Practice id={practiceId} />
      </div>
    );
  };

  renderTest = routerData => {
    let testId = routerData.match.params.tid;
    return (
      <div>
        <Nav />
        <Test id={testId} />
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
        <Route
          exact={true}
          path="/test/:tid"
          component={this.renderTest}
        ></Route>
      </BrowserRouter>
    );
  };
}

let App = connect()(UnconnectedApp);

export default App;
