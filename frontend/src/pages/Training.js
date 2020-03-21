import React from "react";
import "materialize-css/dist/css/materialize.min.css";
//===============================================================

import Footer from "../components/Footer";
import TrainNav from "../components/navs/TrainNav";
import TrainForm from "../components/forms/TrainForm";

class TrainPage extends React.Component {
  render() {
    return (
      <>
        <TrainNav />
        <TrainForm file={this.props.match.params.filename} />
        <Footer />
      </>
    );
  }
}

export default TrainPage;
