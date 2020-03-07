import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import { NavLink } from "react-router-dom";

class DashBoard extends React.Component {
  componentDidMount(){
    var url = "http://localhost:4000"
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
              //no problems
            }
            if (this.status == 403){
              alert("Error");
              document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "loginstring=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href="/login";
            }
            if(this.status == 401){
              alert("Error");
              document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "loginstring=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href="/login";
            }
            if (this.status == 204){
              //not yet logged in. no problem.
              alert("You haven't logged in yet");
              document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "loginstring=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              console.log("Please login");
              window.location.href = "/login";
            }
          }
        }
      }
      sender_object.send();
    }
    check_login_state();
  }
  render() {
    return (
      <>
        <main>
          <h3 className="center">Yet to be Done</h3>
          <a className="btn green">
            <NavLink to="/upload">
              Upload New File
            </NavLink>
          </a>
          <div className="container" id="file_list">

          </div>
        </main>
      </>
    );
  }
}
export default DashBoard;
