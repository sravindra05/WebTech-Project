import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import { NavLink } from "react-router-dom";
// ========================================
import M from "materialize-css";

class TrainNav extends React.Component {
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
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <a className="waves-effect waves-light btn green" href="#">
                  <NavLink to="/dashboard" exact>
                    Dashboard
                  </NavLink>
                </a>
              </li>
              <li>
                <a className="waves-effect waves-light btn green" href="#">
                  <NavLink to="/logout" exact>
                    Logout
                  </NavLink>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
export default TrainNav;
