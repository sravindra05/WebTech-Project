import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import { NavLink } from "react-router-dom";
// ========================================
import M from "materialize-css";

class SignUpNav extends React.Component {
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
                  <NavLink to="/login" exact>
                    Login
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

export default SignUpNav;
