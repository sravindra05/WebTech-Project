import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import { NavLink } from "react-router-dom";
import gen_request from "../../libfx/gen_request";

class TrainForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: this.props.file
    };
  }
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
        if (this.status == 200) {
          let data = JSON.parse(this.response);
          for (let i = 0; i < data["features"].length; i++) {
            var p = document.createElement("p");
            var label = document.createElement("label");
            var span = document.createElement("span");
            span.innerHTML = data["features"][i];
            var radio = document.createElement("input");
            radio.setAttribute("type", "radio");
            radio.setAttribute("class", "target");
            radio.setAttribute("name", "target");
            radio.setAttribute("value", data["features"][i]);
            label.appendChild(radio);
            label.appendChild(span);
            p.appendChild(label);
            document.getElementById("target").appendChild(p);
          }
          for (let i = 0; i < data["features"].length; i++) {
            var p = document.createElement("p");
            var label = document.createElement("label");
            var span = document.createElement("span");
            span.innerHTML = data["features"][i];
            var check = document.createElement("input");
            check.setAttribute("type", "checkbox");
            check.setAttribute("class", "feat");
            check.setAttribute("name", data["features"][i]);
            check.setAttribute("value", data["features"][i]);
            label.appendChild(check);
            label.appendChild(span);
            p.appendChild(label);
            document.getElementById("feature").appendChild(p);
          }
          //document.getElementById("unf").innerHTML = String(data["features"]);
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
    var url =
      "http://localhost:7001/api/bin_class/v1/train/" + String(this.state.file);
    function train() {
      let feat = document.getElementsByClassName("feat");
      var features = [];
      for (let i = 0; i < feat.length; i++) {
        if (feat[i].checked) {
          features.push(feat[i].value);
        }
      }
      if (features.length == 0) {
        alert("Please select atleast one feature. Don't be dumb");
        return;
      }
      var target = document.querySelector('input[name="target"]:checked');
      if (target == null) {
        alert("The fuck do you want me to learn?");
        return;
      }
      var target = document.querySelector('input[name="target"]:checked').value;
      var sender_object = {
        xhr: new XMLHttpRequest(),
        send: function() {
          this.xhr.open("PUT", url, true);
          this.xhr.onreadystatechange = this.callback;
          this.xhr.withCredentials = true;
          let data = new FormData();
          console.log(features);
          data.append("features", features);
          data.append("target", target);
          this.xhr.send(data);
        },
        callback: function() {
          if (this.readyState == 4) {
            if (this.status == 202) {
              alert("Training Complete");
            }
          }
        }
      };
      sender_object.send();
    }

    return (
      <>
        <main id="main" style={{ display: "none" }}>
          <h3 className="center">Learn</h3>
          <div className="container">
            <div className="row">
              <div id="unf" className="col s12 center">
                <form action="#">
                  <div id="feature" className="col s6">
                    <h5 className="center">Select Feature(s)</h5>
                  </div>
                  <div id="target" className="col s6">
                    <h5 className="center">Select Target</h5>
                  </div>
                  <a className="btn waves-effect green" onClick={train}>
                    Learn
                  </a>
                </form>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default TrainForm;
