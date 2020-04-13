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
      file: this.props.file,
    };
  }
  componentDidMount() {
    var url = process.env.REACT_APP_AUTH_SERVER;
    let file = this.props.file;
    function load_form(file) {
      let url = process.env.REACT_APP_CLASSIFIER;
      var sender_object = {
        xhr: new XMLHttpRequest(),
        send: function () {
          this.xhr.open(
            "GET",
            url + "/api/bin_class/v1/get_features/" + String(file),
            true
          );
          this.xhr.onreadystatechange = this.callback;
          this.xhr.withCredentials = true;
          this.xhr.send();
        },
        callback: callback,
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
        send: function () {
          this.xhr.open("POST", url + "/api/uac/v1/check", true);
          this.xhr.onreadystatechange = this.callback;
          this.xhr.withCredentials = true;
          this.xhr.send();
        },
        callback: function () {
          if (this.readyState == 4) {
            if (this.status == 202) {
              //no problems
              document.getElementById("main").style = {};
              load_form(file);
            }
          }
        },
      };
      sender_object.send();
    }
    check_login_state();
  }
  render() {
    var url =
      process.env.REACT_APP_EDA +
      "/api/eda/v1/get_scatter/" +
      String(this.state.file);
    function plot() {
      let feat = document.getElementsByClassName("feat");
      var tot = [];
      var features = [];
      var count = 0;
      for (let i = 0; i < feat.length; i++) {
        if (feat[i].checked) {
          features.push(feat[i].value);
          count += 1;
        }
        tot.push(feat[i].value);
      }
      if (features.length != 2) {
        alert("Please select two features");
        return;
      }
      var target = document.querySelector('input[name="target"]:checked');
      if (target == null) {
        alert("I cannot plot if you don't select a target.");
        return;
      }
      var target = document.querySelector('input[name="target"]:checked').value;
      var sender_object = {
        xhr: new XMLHttpRequest(),
        send: function () {
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
        callback: function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              document.getElementById("others").innerHTML = "";
              var plot_params = JSON.parse(this.response);
              var t = plot_params[target];
              var x = plot_params[features[0]];
              var y = plot_params[features[1]];
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
                  color: "green",
                },
              };
              var negative = {
                x: x_f,
                y: y_f,
                mode: "markers",
                type: "scatter",
                marker: {
                  color: "red",
                },
              };
              var layout = {
                xaxis: {
                  title: {
                    text: features[0],
                    font: {
                      family: "Courier New, monospace",
                      size: 18,
                      color: "#7f7f7f",
                    },
                  },
                },
                yaxis: {
                  title: {
                    text: features[1],
                    font: {
                      family: "Courier New, monospace",
                      size: 18,
                      color: "#7f7f7f",
                    },
                  },
                },
              };

              var data = [positive, negative];
              document.getElementById("plot_wrap").style = {};
              Plotly.newPlot("plot", data, layout);
              var count = 0;
              function insights() {
                if (count == 5) {
                  clearInterval(id);
                } else {
                  var t = plot_params[target];
                  var o = Math.floor(Math.random() * tot.length);
                  var p = Math.floor(Math.random() * tot.length);
                  while (p == o) {
                    p = Math.floor(Math.random() * tot.length);
                  }
                  var x = plot_params[tot[o]];
                  var y = plot_params[tot[p]];
                  console.log(x, y);
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
                      color: "green",
                    },
                  };
                  var negative = {
                    x: x_f,
                    y: y_f,
                    mode: "markers",
                    type: "scatter",
                    marker: {
                      color: "red",
                    },
                  };
                  var layout = {
                    xaxis: {
                      title: {
                        text: tot[o],
                        font: {
                          family: "Courier New, monospace",
                          size: 18,
                          color: "#7f7f7f",
                        },
                      },
                    },
                    yaxis: {
                      title: {
                        text: tot[p],
                        font: {
                          family: "Courier New, monospace",
                          size: 18,
                          color: "#7f7f7f",
                        },
                      },
                    },
                  };
                  var data = [positive, negative];
                  var np = document.createElement("div");
                  np.setAttribute("class", "col s12");
                  np.setAttribute(
                    "style",
                    "min-height:30rem;margin-top:2.5rem"
                  );
                  document.getElementById("others").appendChild(np);
                  Plotly.newPlot(np, data, layout);
                  count++;
                }
              }
              var id = setInterval(function () {
                insights();
              }, 2000);
            }
          }
        },
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
                  className="col s8 offset-s2 "
                  style={{ display: "none" }}
                >
                  <div id="other" className="col s12">
                    <div
                      id="plot"
                      style={{ minHeight: "30rem", marginTop: "2.5rem" }}
                    ></div>

                    <h3 className="center">
                      Here are a few more plots you may find insightful
                    </h3>
                  </div>
                  <div id="others" className="col s12"></div>
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
