import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import { NavLink } from "react-router-dom";
import gen_request from "../../libfx/gen_request";

class TrainForm extends React.Component {
  componentDidMount() {
    var url = "http://localhost:4000";
    let file = this.props.file;
    function load_form(file) {
      let url = "http://localhost:7001";
      var sender_object = {
        xhr: new XMLHttpRequest(),
        send: function() {
          this.xhr.open(
            "GET",
            url + "/api/bin_class/v1/get_features/" + String(file),
            true
          );
          this.xhr.onreadystatechange = this.callback;
          this.xhr.withCredentials = true;
          this.xhr.send();
        },
        callback: callback
      };
      sender_object.send();
    }
    function callback() {
      if (this.readyState == 4) {
        console.log("hi");
        if (this.status == 200) {
          let data = JSON.parse(this.response);
          console.log(data);

          document.getElementById("unf").innerHTML = String(data["features"]);
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
              load_form(file);
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
          <h3 className="center">Train</h3>
          <div className="container">
            <div className="row">
              <div id="unf" className="col s12 center"></div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default TrainForm;
