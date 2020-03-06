import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
// ========================================
import M from "materialize-css";

class SignUpForm extends React.Component {
  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
  }
  render() {
    return (
      <>
        <main className="valign-wrapper">
          <div className="row">
            <div className="col s12 m10 offset-m1 card center">
              <h5>Sign-Up</h5>
              <div className="input-field col s12">
                <input
                  className="validate"
                  type="text"
                  name="username"
                  id="email"
                  required
                />
                <label for="email">Username</label>
              </div>

              <div className="input-field col s12">
                <input
                  className="validate"
                  type="password"
                  name="password"
                  id="password"
                  required
                />
                <label for="password">Password</label>
              </div>
              <button className="btn btn-small green waves-effect">
                SignUp
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default SignUpForm;
