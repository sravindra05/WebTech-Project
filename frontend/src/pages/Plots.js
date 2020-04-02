import React from "react";
import "materialize-css/dist/css/materialize.min.css";
//===============================================================

import Footer from "../components/Footer";
import TrainNav from "../components/navs/TrainNav";
import PlotForm from "../components/forms/PlotForm";

class PlotPage extends React.Component {
  render() {
    return (
      <>
        <TrainNav />
        <PlotForm file={this.props.match.params.filename} />
        <Footer />
      </>
    );
  }
}

export default PlotPage;
