import React, { Fragment, Component } from "react";
import "./App.css";
import {
  withRouter,
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Cookies from "js-cookie";
/* Fan Views */
import Profile from "./InappViews/Profile";
import Footer from "./InappViews/footer";
import Info from "./Info";
import Artists from "./Order";
import Checkout from "./InappViews/checkout";
import BestDeals from "./InappViews/bestdeals";
import InMenu from "./InappViews/inMen";
import Stream from "./InappViews/stream";

/* Creator Views */
import CreatorMenu from "./CreatorViews/createMenu";
import Performances from "./CreatorViews/performance";
import Config from "./CreatorViews/configPerformance";
import CreatorProfile from "./CreatorViews/Profile";

/* Entry Views */
import CentralText from "./EntryViews/CentralText";
import NavBar from "./EntryViews/Menu";
import Background from "./InappViews/concert.jpg";

const NotFound = () => <div> Not found </div>;

const NotFoundRedirect = () => <div />;
class App extends Component {
  constructor(props) {
    super(props);
    // we track the zipcode in state because we need to pass this onto the next page we load
    this.state = {
      page: "",
    };
  }
  // our send data function sets the state correctly to use the data passed on by the child component
  updateCurrentBundle(value) {
    ////console.log(value,999999)
    this.setState({
      bundle: value,
    });
  }
  auth() {
    let value = Cookies.get("session_token");
    ////console.log(value)
    if (!value) {
      return (
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <div>
                <NavBar {...props} update={this.auth.bind(this)} />{" "}
                <CentralText {...props} />{" "}
              </div>
            )}
          />{" "}
          <Route component={NotFoundRedirect} />{" "}
        </Switch>
      );
    }
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => (
            <div
              style={{
                backgroundImage: `url(${Background})`,
                height: "1540px",
                width: "1500px",
              }}
            >
              <NavBar {...props} update={this.auth.bind(this)} />{" "}
              <CentralText {...props} />{" "}
            </div>
          )}
        />{" "}
        <Route
          exact
          path="/creator"
          render={(props) => (
            <div>
              <CreatorMenu {...props} />{" "}
              <div
                style={{
                  marginTop: "0px",
                  marginRight: "0px",
                  background: "#F6F7F6",
                  width: "1450px",
                }}
              >
                <Performances
                  {...props}
                  sendBundle={this.updateCurrentBundle.bind(this)}
                />{" "}
                <Footer />
              </div>{" "}
            </div>
          )}
        />{" "}
        <Route
          exact
          path="/feed"
          render={(props) => (
            <div>
              <InMenu {...props} />{" "}
              <div
                style={{
                  marginTop: "0px",
                  marginRight: "0px",
                  background: "#F6F7F6",
                  width: "1450px",
                }}
              >
                <BestDeals
                  {...props}
                  sendBundle={this.updateCurrentBundle.bind(this)}
                />{" "}
                <Footer />
              </div>{" "}
            </div>
          )}
        />{" "}
        <Route
          exact
          path="/profile"
          render={(props) => (
            <div>
              <InMenu {...props} />{" "}
              <div
                style={{
                  marginTop: "0px",
                  marginRight: "0px",
                  background: "#F6F7F6",
                  width: "1450px",
                }}
              >
                <Profile {...props} /> <Footer />
              </div>{" "}
            </div>
          )}
        />{" "}
        <Route
          path="/analytics:id"
          render={(props) => (
            <div>
              <CreatorMenu {...props} />{" "}
              <div
                style={{
                  marginTop: "0px",
                  marginRight: "0px",
                  background: "#F6F7F6",
                  width: "1450px",
                }}
              >
                <Config {...props} /> <Footer />
              </div>{" "}
            </div>
          )}
        />{" "}
        <Route
          path="/watch:id"
          render={(props) => (
            <div>
              <InMenu {...props} />{" "}
              <div
                style={{
                  marginTop: "0px",
                  marginRight: "0px",
                  background: "#F6F7F6",
                  width: "1450px",
                }}
              >
                <Stream {...props} /> <Footer />
              </div>{" "}
            </div>
          )}
        />{" "}
        <Route
          exact
          path="/createconfig"
          render={(props) => (
            <div>
              <CreatorMenu {...props} />{" "}
              <div
                style={{
                  marginTop: "0px",
                  marginRight: "0px",
                  background: "#F6F7F6",
                  width: "1450px",
                }}
              >
                <CreatorProfile {...props} /> <Footer />
              </div>{" "}
            </div>
          )}
        />{" "}
        <Route
          exact
          path="/artists"
          render={(props) => (
            <div>
              <InMenu {...props} />{" "}
              <div
                style={{
                  marginTop: "0px",
                  marginRight: "0px",
                  background: "#F6F7F6",
                  width: "1450px",
                }}
              >
                <Artists {...props} /> <Footer />
              </div>{" "}
            </div>
          )}
        />{" "}
        <Route
          path="/wood"
          render={(props) => (
            <div
              style={{
                marginTop: "0px",
                marginRight: "0px",
                background: "#F6F7F6",
                width: "1450px",
              }}
            >
              <Info {...props} bundleData={this.state.bundle} />{" "}
            </div>
          )}
        />{" "}
        <Route
          path="/check:id"
          render={(props) => (
            <div>
              <Checkout {...props} bundleData={this.state.bundle} />{" "}
            </div>
          )}
        />{" "}
        <Route component={NotFoundRedirect} />{" "}
      </Switch>
    );
  }
  render() {
    const { redirect } = this.state;
    const login = this.auth();
    return (
      <Router>
        <div className="myroot"> {login} </div>{" "}
      </Router>
    );
  }
}
export default withRouter(App);
