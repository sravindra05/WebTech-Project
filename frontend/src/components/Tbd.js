import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import Nav from "./navs/Nav";
import Footer from "./Footer";

class Tbd extends React.Component {
  render() {
    return (
      <>
        <Nav />
        <main>
          <h3 className="center">Yet to be Done</h3>
        </main>
        <Footer />
      </>
    );
  }
}
export default Tbd;
