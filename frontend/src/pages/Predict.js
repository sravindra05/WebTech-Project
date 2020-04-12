import React from "react";
import "materialize-css/dist/css/materialize.min.css";
//===============================================================

import Footer from "../components/Footer";
import TrainNav from "../components/navs/TrainNav";
import PredictForm from "../components/forms/PredictForm";

class PredictPage extends React.Component {
  render() {
    return (
      <>
        <TrainNav />
        <PredictForm file={this.props.match.params.filename} />
        <Footer />
      </>
    );
  }
}

export default PredictPage;
