import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import { NavLink } from "react-router-dom";
// ========================================
import M from "materialize-css";

class WelcomeNav extends React.Component {
  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper black">
          <a href="#" className="brand-logo">
            The SCARS Project
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <a className="waves-effect waves-light btn" href="#">
                <NavLink to="/:userid/graph">Plot</NavLink>
              </a>
              <a className="waves-effect waves-light btn" href="#">
                <NavLink to="/:userid/train">Train</NavLink>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default WelcomeNav;
