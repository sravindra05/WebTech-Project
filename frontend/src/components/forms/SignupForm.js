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
    var url = process.env.REACT_APP_AUTH_SERVER
    function attempt_signup(){
      var md5 = require('../../../node_modules/md5');
      var sender_object = {
        xhr: new XMLHttpRequest(),
        send:function(){
          this.xhr.open("POST",url+"/api/uac/v1/signup",true);
          this.xhr.onreadystatechange = this.callback;
          let data = new FormData();
          data.append("username",document.getElementById("username").value);
          data.append("password",md5(document.getElementById("password").value));
          this.xhr.send(data);
        },
        callback:function(){
          if (this.readyState == 4){
            if (this.status == 202){
              alert("Successful signup")
            }
          if (this.status == 403){
            alert("Error User found");
          }
          if(this.status == 400){
            alert("Please fill data");
          }
          }
        }
      }
      sender_object.send()
    }
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
                  id="username"
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
              <button className="btn btn-small green waves-effect" onClick={attempt_signup}>
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
