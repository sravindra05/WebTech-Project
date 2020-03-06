import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import { NavLink } from "react-router-dom";
// ========================================
import M from "materialize-css";

class Nav extends React.Component {
  componentDidMount() {
    M.AutoInit();
  }

  render() {
    return (
      <header>
        <nav>
          <div className="nav-wrapper black">
            <a href="#" className="brand-logo">
              The SCARS Project
            </a>
          </div>
        </nav>
      </header>
    );
  }
}

export default Nav;
