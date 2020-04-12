import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
// ========================================

class Intro extends React.Component {
  render() {
    return (
      <>
        <main className="valign-wrapper">
          <div className="row">
            <div className="col s12 m10 offset-m1 card center">
              <h3>
                Welcome to SCARS
              </h3>
              <h4>Scalable Charting and Research Service</h4>
              <h5>This service helps you train models and see analytics about your data without the hassle of writing any code yourself.</h5>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default Intro;
