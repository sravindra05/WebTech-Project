import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
// ========================================
import M from "materialize-css";
import gen_request from "../../libfx/gen_request"
class UploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          file: this.props.file,
        };
      }
  componentDidMount() {
    var info = String(this.props.file)
    function get_meta(){
        
        info = info.split("!")
        document.getElementById("filename").innerText = "Model Name: "+info
        document.getElementById("srcfile").innerText = "Dataset: "+info[2]
        document.getElementById("features").innerText = "Features: "+info[0]
        document.getElementById("target").innerText = "Target: "+info[1]
        var input = document.getElementById("inputs")
        var features = info[0].split("|")
        for (let item in features){
            var ip = document.createElement("input");
            ip.type = "text";
            ip.id = features[item];
            ip.placeholder = features[item];
            input.appendChild(ip);
        }
    }
    M.AutoInit();
    get_meta();
  }

  render() {
    var modelfile = this.props.file
    var url = process.env.REACT_APP_CLASSIFIER;
    function predict(){
        var sender_object = {
            xhr: new XMLHttpRequest(),
            send: function () {
              this.xhr.open(
                "POST",
                url + "/api/bin_class/v1/query/" + String(modelfile),
                true
              );
              this.xhr.onreadystatechange = this.callback;
              this.xhr.withCredentials = true;
              var data = new FormData()
              var features = modelfile.split("!")[0].split("|")
              for (let item in features){
                  data.append(features[item],document.getElementById(features[item]).value)
              }
              console.log(data)
              this.xhr.send(data);
            },
            callback: callback,
          };
          sender_object.send();
          function callback(){
              if (this.readyState == 4){
                  if (this.status == 403){
                      alert("Model not found")
                  }
                  if(this.status == 423){
                      alert("The model is in use. Please wait")
                  }
                  if (this.status == 200){
                     let div = document.getElementById("output")
                     div.innerText = this.responseText
                     console.log(this.responseText)
                  }
              }
          }
    }
    
    return (
      <>
        <main className="valign-wrapper">
          <div className="row">
            <div className="col s12 m12 card center">
              <label>Query Model</label>
              <div id="metadata">
                    <h5>Model Metadata</h5>
                    <p style={{"font-size": "large"}} id="filename"></p>
                    <p style={{"font-size": "large"}} id="srcfile"></p>
                    <p style={{"font-size": "large"}} id="features"></p>
                    <p style={{"font-size": "large"}} id="target"></p>
              </div>
              <br></br>
              <h5>Inputs:</h5>
              <div id="inputs">

              </div>
              <br></br>
              <div>
                <h5>Result:</h5>
                <p id="output"></p>
              </div>
            </div>
            <a href="#" className="btn blue white-text center" onClick={predict}>Predict</a>
          </div>
        </main>
      </>
    );
  }
}

export default UploadForm;
