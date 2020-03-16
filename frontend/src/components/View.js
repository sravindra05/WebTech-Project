import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import Nav from "./navs/Nav";
import Footer from "./Footer";
import 'react-tabulator/lib/styles.css';
import { ReactTabulator } from 'react-tabulator'
import gen_request from "../libfx/gen_request";

class View extends React.Component {
  componentDidMount(){
      function get_data(){
        url = "http://localhost:6000";
        gen_request("GET",url+"/api/eda/v1/view/",6000,{},after_get_data);
        function after_get_data(){
            
        }
      }
      get_data();
  }
  render() {
    return (
      <>
        <Nav />
        <main>
          <h3 className="center">Look at your data. Peel your eyes.</h3>
        </main>
        <Footer />
      </>
    );
  }
}
export default View;
