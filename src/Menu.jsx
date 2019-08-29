import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./menu.css";

class Menu extends Component {
  render() {
    return (
      <div className="border practice-container">
        <div className="flex border">
          <Link className="circle" to="/practice/1">
            1
          </Link>
        </div>
      </div>
    );
  }
}

export default Menu;
