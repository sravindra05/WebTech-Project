import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
// ========================================
import M from "materialize-css";
import gen_request from "../../libfx/gen_request"
class UploadForm extends React.Component {
  componentDidMount() {
    M.AutoInit();
  }
  render() {
    var url = "http://localhost:5000";
    function upload_file(){
      let selected_file = document.getElementById("files").files[0]
      let data = new FormData();
      data.append("filename",selected_file.name);
      data.append("file_itself",selected_file);
      gen_request("POST",url+"/api/user/v1/newfile",5000,data,callback);
      function callback(){
        if (this.readyState == 4){
          if (this.status == 200){
            //success
            alert("file uploaded successfully");
          }
          if (this.status == 409){
            alert("File already exists");
          }
        }
      }
    }
    return (
      <>
        <main className="valign-wrapper">
          <div className="row">
            <div className="col s12 m12 card center">
              <label>Materialize File Input</label>
              <div className="file-field input-field">
                <div className="btn">
                  <span>Browse</span>
                  <input id="files" type="file" />
                </div>

                <div className="file-path-wrapper">
                  <input
                    className="file-path validate"
                    type="text"
                    placeholder="Upload file"
                  />
                </div>
              </div>
            </div>
            <a href="#" className="btn blue white-text" onClick={upload_file}>Upload File</a>
          </div>
        </main>
      </>
    );
  }
}

export default UploadForm;
