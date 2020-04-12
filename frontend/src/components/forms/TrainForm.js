import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import { NavLink } from "react-router-dom";
import gen_request from "../../libfx/gen_request";

class TrainForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: this.props.file,
    };
  }
  componentDidMount() {
    var url1 = process.env.REACT_APP_AUTH_SERVER;
    let file = this.props.file;
    function load_form(file) {
      let url1 = process.env.REACT_APP_CLASSIFIER;
      var sender_object = {
        xhr: new XMLHttpRequest(),
        send: function () {
          this.xhr.open(
            "GET",
            url1 + "/api/bin_class/v1/get_features/" + String(file),
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
          this.xhr.open("POST", url1 + "/api/uac/v1/check", true);
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
    var url1 =process.env.REACT_APP_CLASSIFIER+"/api/bin_class/v1/train/" + String(this.state.file);
    
    var datafile = this.state.file;
    function train() {
      let feat = document.getElementsByClassName("feat");
      var features = [];
      for (let i = 0; i < feat.length; i++) {
        if (feat[i].checked) {
          features.push(feat[i].value);
        }
      }
      if (features.length == 0) {
        alert("Please select atleast one feature to train on.");
        return;
      }
      var target = document.querySelector('input[name="target"]:checked');
      if (target == null) {
        alert("Please pick some parameter to learn");
        return;
      }
      var target = document.querySelector('input[name="target"]:checked').value;
      var sender_object = {
        xhr: new XMLHttpRequest(),
        send: function () {
          this.xhr.open("PUT", url1, true);
          this.xhr.onreadystatechange = this.callback;
          this.xhr.withCredentials = true;
          let data = new FormData();
          console.log(features);
          data.append("features", features);
          data.append("target", target);
          this.xhr.send(data);
        },
        callback: function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              alert("Training Complete");
              // for (let i = 0; i < features.length; i++) {
              //   var div = document.createElement("div");
              //   div.setAttribute("class", "col s6 offset-s3");
              //   var text = document.createElement("input");
              //   text.setAttribute("type", "text");
              //   text.setAttribute("class", "queries");
              //   text.setAttribute("placeholder", features[i]);
              //   document.getElementById("feature_q").appendChild(text);
              // }
              // document.getElementById("query").style = {};
            }
          }
        },
      };
      sender_object.send();
    }

    function load_table() {
      let url = process.env.REACT_APP_CLASSIFIER;
      gen_request(
        "GET",
        url + "/api/bin_class/v1/get_models/"+String(datafile),
        7001,
        {},
        callback
      );
      function callback() {
        if (this.readyState == 4) {

          if (this.status == 201) {
            let newp = document.createElement("p");
            newp.innerHTML = "You have no models";
            document.getElementById("model_list").appendChild(newp);
          }
          if (this.status == 200) {
            let data = JSON.parse(this.response);
            let div = document.getElementById("model_list");
            for (var key in data) {
              let newdiv = document.createElement("div");
              newdiv.className = "col s12";
              let newp = document.createElement("p");
              newp.style = "display: inline-block";
              newp.innerText =
                "Model Index: " + data[key]["id"] + " Features: " + data[key]["features"] + " Target: "+ data[key]["target"];

              
              let newpredict = document.createElement("a");
              newpredict.className = "btn white-text green";
              newpredict.style = "display: inline-block;float:right";
              newpredict.target = data[key]["filename"];
              newpredict.innerText = "Predict";
              newpredict.href = "/predict/" + data[key]["filename"];
              newpredict.onclick = null;

              let newdelete = document.createElement("a");
              newdelete.className = "btn white-text red";
              newdelete.style = "display: inline-block;float:right";
              newdelete.target = data[key]["filename"];
              newdelete.innerText = "Delete";
              newdelete.onclick = delete_model;
              
              newdiv.appendChild(newdelete);
              newdiv.appendChild(newpredict);
              newdiv.appendChild(newp);
              div.appendChild(newdiv);
            }
          }
          setTimeout(function(){reset_table();load_table()},10000); //periodic refresh
        }
      }
    }
    
    function reset_table(){
      var table = document.getElementById("model_list");
      while (table.children.length > 0){
        table.removeChild(table.lastChild);
      }
    }
    function delete_model(model_to_delete) {
      let url = process.env.REACT_APP_CLASSIFIER;
      gen_request(
        "DELETE",
        url + "/api/bin_class/v1/delete_model/" + String(model_to_delete.target.target),
        7001,
        {},
        after_delete
      );
      function after_delete() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            alert("Model deleted successfully");
          }
          if (this.status == 403){
            alert("Model not found");
          }
        }
      }
    }
    load_table();
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
            <h4>Existing Models</h4>
            <div class="row" id="model_list">

            </div> 
          </div>
        </main>
      </>
    );
  }
}

export default TrainForm;
