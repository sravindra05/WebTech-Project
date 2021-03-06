import React from "react";
import ReactDOM from "react-dom";

import "materialize-css/dist/css/materialize.min.css";
// ========================================
import M from "materialize-css";
import 'md5';

class LoginForm extends React.Component {
  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
    var url = process.env.REACT_APP_AUTH_SERVER;
    function check_login_state(){
      var sender_object = {
        xhr: new XMLHttpRequest(),
        send:function(){
          this.xhr.open("POST",url+"/api/uac/v1/check",true);
          this.xhr.onreadystatechange = this.callback;
          this.xhr.withCredentials = true;
          this.xhr.send();
        },
        callback:function(){
          if (this.readyState == 4){
            if (this.status == 202){
              alert("You are already logged in");
              window.location.href = "/dashboard";
            }
            if (this.status == 403){
              alert("User not found");
              document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "loginstring=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href="/login";
            }
            if(this.status == 401){
              alert("Unauthorized, incorrect password");
              document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "loginstring=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href="/login";
            }
            if (this.status == 204){
              //not yet logged in. no problem.
              document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "loginstring=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              console.log("Please login");
            }
          }
        }
      }
      sender_object.send();
    }
    check_login_state();
  }
  render() {
    var url = process.env.REACT_APP_AUTH_SERVER;
    function attempt_login(){
      var md5 = require('../../../node_modules/md5');
      var sender_object = {
        xhr: new XMLHttpRequest(),
        send:function(){
          this.xhr.open("POST",url+"/api/uac/v1/login",true);
          this.xhr.onreadystatechange = this.callback;
          this.xhr.withCredentials = true;
          let data = new FormData();
          data.append("username",document.getElementById("username").value);
          data.append("password",md5(document.getElementById("password").value));
          console.log(data);
          this.xhr.send(data);
        },
        callback:function(){
          if (this.readyState == 4){
            if (this.status == 202){
              alert("Successful login");
              window.location.href = "/dashboard";
              }
          
          if (this.status == 403){
            alert("User not found");
          }
          if(this.status == 401){
            alert("Unauthorized, incorrect password");
          }
          if(this.status == 400){
            alert("Please fill data");
          }
          }
        }
      }
      sender_object.send();
    }
    return (
      <>
      
        <main className="valign-wrapper">
        
          <div className="row">
            <div className="col s12 m10 offset-m1 card center">
              <h5>Login</h5>
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
              <button className="btn btn-small green waves-effect" onClick={attempt_login}>
                Login
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default LoginForm;
