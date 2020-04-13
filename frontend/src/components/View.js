import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import WelcomeNav from "./navs/WelcomeNav";
import Footer from "./Footer";

import gen_request from "../libfx/gen_request";
var Tabulator = require("tabulator-tables");
class View extends React.Component {
  componentDidMount() {
    function getUrlVars() {
      var vars = {};
      let count = 0;
      var parts = window.location.href.replace(/[\/]([^\/]*)/gi, function (
        m,
        value
      ) {
        vars[count] = value;
        count += 1;
      });
      return vars;
    }
    function get_data() {
      let url = process.env.REACT_APP_EDA;
      gen_request(
        "GET",
        url + "/api/eda/v1/gen_view/" + getUrlVars()[3],
        6000,
        {},
        after_get_data
      );
      function after_get_data() {
        if (this.readyState == 4) {
          if (this.status == 406) {
            alert("Invalid File");
          } else {
            if (this.status == 200) {
              let data = JSON.parse(this.response);
              console.log(data.headers);
              var table = new Tabulator("#datatable");
              table.setColumns(data.headers);
              table.setData(data.data);
            }
          }
        }
      }
    }
    get_data();
  }
  render() {
    return (
      <>
        <WelcomeNav />
        <main id="main">
          <link
            href="https://unpkg.com/tabulator-tables@4.5.3/dist/css/tabulator.min.css"
            rel="stylesheet"
          />
          <script
            type="text/javascript"
            src="https://unpkg.com/tabulator-tables@4.5.3/dist/js/tabulator.min.js"
          ></script>
          <h4 className="center">Here is your data</h4>
          <div id="datatable" className="container center"></div>
        </main>
        <Footer />
      </>
    );
  }
}
export default View;
