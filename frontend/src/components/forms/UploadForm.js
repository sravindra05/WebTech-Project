import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
// ========================================
import M from "materialize-css";

class UploadForm extends React.Component {
  componentDidMount() {
    M.AutoInit();
  }
  render() {
    return (
      <>
        <main className="valign-wrapper">
          <div className="row">
            <div className="col s12 m12 card center">
              <label>Materialize File Input</label>
              <div className="file-field input-field">
                <div className="btn">
                  <span>Browse</span>
                  <input type="file" />
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
          </div>
        </main>
      </>
    );
  }
}

export default UploadForm;
