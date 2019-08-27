import React, { Component } from "react";
import { Link } from "react-router-dom";

class Menu extends Component {
  render() {
    return (
      <div>
        <Link to="/practice/1">Practice 1</Link>
      </div>
    );
  }
}

export default Menu;
