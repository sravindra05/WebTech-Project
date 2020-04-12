import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import { NavLink } from "react-router-dom";
import gen_request from "../../libfx/gen_request";
import Plotly from "plotly.js-dist";
class PlotForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: this.props.file
    };
  }
  componentDidMount() {
    var url = process.env.REACT_APP_AUTH_SERVER;
    let file = this.props.file;
    function load_form(file) {
      let url = process.env.REACT_APP_CLASSIFIER;
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
    var url =process.env.REACT_APP_EDA + "/api/eda/v1/get_scatter/" + String(this.state.file);
    function plot() {
      let feat = document.getElementsByClassName("feat");
      var features = [];
      var count = 0;
      for (let i = 0; i < feat.length; i++) {
        if (feat[i].checked) {
          features.push(feat[i].value);
          count += 1;
        }
      }
      if (features.length == 0) {
        alert("Please select atleast one feature. Don't be dumb");
        return;
      }
      if (features.length > 2) {
        alert("Please select atmost 2 features. Don't be dumb");
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
          this.xhr.open("POST", url, true);
          this.xhr.onreadystatechange = this.callback;
          this.xhr.withCredentials = true;
          let data = new FormData();
          console.log(features);
          data.append("x", features[0]);
          data.append("y", features[1]);
          data.append("target", target);
          console.log(data.getAll("y"));
          this.xhr.send(data);
        },
        callback: function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              var plot_params = JSON.parse(this.response);
              var t = plot_params["target"];
              var x = plot_params["x"];
              var y = plot_params["y"];
              var x_t = [];
              var y_t = [];
              var x_f = [];
              var y_f = [];
              for (let i = 0; i < t.length; i++) {
                if (t[i] == 1) {
                  x_t.push(x[i]);
                  y_t.push(y[i]);
                } else {
                  x_f.push(x[i]);
                  y_f.push(y[i]);
                }
              }
              var positive = {
                x: x_t,
                y: y_t,
                mode: "markers",
                type: "scatter",
                marker: {
                  color: "green"
                }
              };
              var negative = {
                x: x_f,
                y: y_f,
                mode: "markers",
                type: "scatter",
                marker: {
                  color: "red"
                }
              };
              /*var trace2 = {
                x: [2, 3, 4, 5],
                y: [16, 5, 11, 9],
                mode: "lines",
                type: "scatter"
              };

              var trace3 = {
                x: [1, 2, 3, 4],
                y: [12, 9, 15, 12],
                mode: "lines+markers",
                type: "scatter"
              };*/

              var data = [positive, negative];
              document.getElementById("plot_wrap").style = {};
              Plotly.newPlot("plot", data);
            }
          }
        }
      };
      sender_object.send();
    }

    return (
      <>
        <main id="main" style={{ display: "none" }}>
          <script src="../../plotly-latest.min.js"></script>
          <h3 className="center">Scatter Plot</h3>
          <div className="container">
            <div className="row">
              <div id="unf" className="col s12 center">
                <form action="#">
                  <div id="feature" className="col s6">
                    <h5 className="center">Select Features (At most 2)</h5>
                  </div>
                  <div id="target" className="col s6">
                    <h5 className="center">Select Target</h5>
                  </div>
                  <a className="btn waves-effect green" onClick={plot}>
                    Plot
                  </a>
                </form>
              </div>
              <div className="row">
                <div
                  id="plot_wrap"
                  className="col s8 offset-s2 card"
                  style={{ display: "none" }}
                >
                  <div
                    id="plot"
                    style={{ minHeight: "30rem", marginTop: "2.5rem" }}
                    className="col s12"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default PlotForm;
