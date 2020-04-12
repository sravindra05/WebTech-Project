import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css";
class Footer extends React.Component {
  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
  }
  render() {
    return (
      <footer className="page-footer black">
        <div className="container">
          <div className="row">
            <div className="col l6 s12">
              <h5 className="white-text">The SCARS Project</h5>
              <p className="grey-text text-lighten-4">
                Web tools for your graphing needs.
              </p>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            © 2020 Copyright
          </div>
        </div>
      </footer>
    );
  }
}
export default Footer;
