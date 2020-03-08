import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import { NavLink } from "react-router-dom";
import gen_request from "../libfx/gen_request";

class DashBoard extends React.Component {
  
  componentDidMount(){
    var url = "http://localhost:4000"
    function load_table(){
      let url = "http://localhost:5000"
      gen_request("GET",url+"/api/user/v1/get_file_list",5000,{},callback);
      function callback(){
        if (this.readyState == 4){
          if(this.status == 204){
            document.getElementById("file_list").innerHTML = "<p>You currently have no life and no files";
          }
          if (this.status == 200){
            let data  = JSON.parse(this.response);
            let div =  document.getElementById("file_list");
            for(var key in data){
              let newdiv = document.createElement("div")
              newdiv.className="row"
              let newp = document.createElement('p');newp.style="display: inline-block";
              newp.innerText = data[key]['filename'] + " File Size: "+data[key]['file_size'];
              let newplot = document.createElement('a');newplot.className="btn white-text blue";newplot.style="display: inline-block;float:right";
              let newlearn = document.createElement('a');newlearn.className="btn white-text pink";newlearn.style="display: inline-block;float:right";
              let newdelete = document.createElement('a');newdelete.className="btn white-text red";newdelete.style="display: inline-block;float:right";
              newplot.innerText = "Plot";
              newlearn.innerText="Learn";
              newdelete.innerText = "Delete";
              newdiv.appendChild(newp);
              newdiv.appendChild(newdelete);
              newdiv.appendChild(newlearn);
              newdiv.appendChild(newplot);
              div.appendChild(newdiv);
            }
          }
        }
      }
    }
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
              document.getElementById("main").style={};
              load_table();
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
        <main id="main" style={{display:"none"}}>
          <h3 className="center">Dashboard</h3>
          <a className="btn green">
            <NavLink to="/upload" className="white-text">
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
