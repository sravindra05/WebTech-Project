import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import { NavLink } from "react-router-dom";
import gen_request from "../libfx/gen_request";

class DashBoard extends React.Component {
  componentDidMount() {
    var url = "http://localhost:4000";
    function view_file(file_to_view) {
      console.log(file_to_view.target.target);
      window.location.href = "/view/" + file_to_view.target.target;
    }
    function delete_file(file_to_delete) {
      let url = "http://localhost:5000";
      //console.log(file_to_delete.target.id);
      gen_request(
        "DELETE",
        url + "/api/user/v1/delete_file/" + file_to_delete.target.target,
        5000,
        {},
        after_delete
      );
      function after_delete() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            alert("File deleted successfully");
            //window.location.reload();
          }
        }
      }
    }
    function reset_table(){
      var table = document.getElementById("file_list");
      while (table.children.length > 1){
        table.removeChild(table.lastChild);
      }
    }
    
    function load_table() {
      let url = "http://localhost:5000";
      gen_request(
        "GET",
        url + "/api/user/v1/get_file_list",
        5000,
        {},
        callback
      );
      function callback() {
        if (this.readyState == 4) {

          if (this.status == 204) {
            let newp = document.createElement("p");
            newp.innerHTML = "You have no files";
            document.getElementById("file_list").appendChild(newp);
          }
          if (this.status == 200) {
            let data = JSON.parse(this.response);
            let div = document.getElementById("file_list");
            for (var key in data) {
              let newdiv = document.createElement("div");
              newdiv.className = "col s12";
              let newp = document.createElement("p");
              newp.style = "display: inline-block";
              newp.innerText =
                data[key]["filename"] + " File Size: " + data[key]["file_size"];

              let newplot = document.createElement("a");
              newplot.className = "btn white-text blue";
              newplot.style = "display: inline-block;float:right";
              newplot.innerText = "Plot";
              newplot.target = data[key]["filename"];
              newplot.href = "/plot/" + data[key]["filename"];
              newplot.onclick = null;

              let newlearn = document.createElement("a");
              newlearn.className = "btn white-text pink";
              newlearn.style = "display: inline-block;float:right";
              newlearn.innerText = "Learn";
              newlearn.target = data[key]["filename"];
              newlearn.href = "/train/" + data[key]["filename"];

              let newview = document.createElement("a");
              newview.className = "btn white-text green";
              newview.style = "display: inline-block;float:right";
              newview.target = data[key]["filename"];
              newview.innerText = "View";
              newview.href = "/view/" + data[key]["filename"];
              newview.onclick = null;

              let newdelete = document.createElement("a");
              newdelete.className = "btn white-text red";
              newdelete.style = "display: inline-block;float:right";
              newdelete.target = data[key]["filename"];
              newdelete.innerText = "Delete";
              newdelete.target = data[key]["filename"];
              newdelete.onclick = delete_file;

              newdiv.appendChild(newp);
              newdiv.appendChild(newdelete);
              newdiv.appendChild(newview);
              newdiv.appendChild(newlearn);
              newdiv.appendChild(newplot);

              //div.insertBefore(newdiv, document.getElementById("uploadbtn"));
              div.appendChild(newdiv);
            }
          }
          setTimeout(function(){reset_table();load_table()},10000); //periodic refresh
        }
      }
    }
    function check_login_state() {
      var sender_object = {
        xhr: new XMLHttpRequest(),
        send: function() {
          this.xhr.open("POST", url + "/api/uac/v1/check", true);
          this.xhr.onreadystatechange = this.callback;
          this.xhr.withCredentials = true;
          this.xhr.send();
        },
        callback: function() {
          if (this.readyState == 4) {
            if (this.status == 202) {
              //no problems
              document.getElementById("main").style = {};
              load_table();
            }
            if (this.status == 403) {
              alert("Error");
              document.cookie =
                "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie =
                "loginstring=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/login";
            }
            if (this.status == 401) {
              alert("Error");
              document.cookie =
                "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie =
                "loginstring=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/login";
            }
            if (this.status == 204) {
              //not yet logged in. no problem.
              alert("You haven't logged in yet");
              document.cookie =
                "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie =
                "loginstring=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              console.log("Please login");
              window.location.href = "/login";
            }
          }
        }
      };
      sender_object.send();
    }
    check_login_state();
  }
  render() {
    return (
      <>
        <main id="main" style={{ display: "none" }}>
          <h3 className="center">Dashboard</h3>
          <div className="container">
            <div className="row" id="file_list">
              <div id="uploadbtn" className="col s12 center">
                <a className="btn green">
                  <NavLink to="/upload" target="_blank" className="white-text">
                    Upload New File
                  </NavLink>
                </a>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}
export default DashBoard;
