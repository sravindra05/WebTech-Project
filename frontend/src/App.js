import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "materialize-css/dist/css/materialize.min.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
//===============================================================
import Nav from "./components/navs/Nav";
import LoginNav from "./components/navs/LoginNav";
import LandingNav from "./components/navs/LandingNav";
import WelcomeNav from "./components/navs/WelcomeNav";
import LoginForm from "./components/forms/LoginForm";
import SignUpForm from "./components/forms/SignupForm";
import UploadForm from "./components/forms/UploadForm";
import Footer from "./components/Footer";
import Intro from "./components/Intro";
import Tbd from "./components/Tbd";
import DashBoard from "./components/DashBoard";
import DashNav from "./components/navs/DashNav";
import SignUpNav from "./components/navs/SignUpNav";
import Logout from "./components/Logout";
import View from "./components/View";
import M from "materialize-css";
//==============================================================
class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <>
              <LandingNav />
              <Intro />
              <Footer />
            </>
          </Route>
          <Route path="/login" exact>
            <>
              <LoginNav />
              <LoginForm />
              <Footer />
            </>
          </Route>
          <Route path="/signup" exact>
            <>
              <SignUpNav />
              <SignUpForm />
              <Footer />
            </>
          </Route>
          <Route path="/dashboard" exact>
            <>
              <DashNav />
              <DashBoard/>
              <Footer />
            </>
          </Route>
          <Route path="/logout" exact>
            <>
              <Nav />
              <Logout/>
              <Footer />
            </>
          </Route>
          <Route path="/upload" exact>
            <>
              <WelcomeNav />
              <UploadForm />
              <Footer />
            </>
          </Route>
          <Route path="/graph/:fileid" exact>
            <>
              <Tbd />
            </>
          </Route>
          <Route path="/view/:fileid" exact>
            <>
              <View />
            </>
          </Route>
          <Route path="/train/:fileid" exact>
            <>
              <Tbd />
            </>
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

export default App;
