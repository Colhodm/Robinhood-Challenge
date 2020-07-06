import React, { Fragment, Component } from "react";
import "./App.css";
import {
  withRouter,
  BrowserRouter as Router,
  Switch,
  Route,

} from "react-router-dom";
/* Fan Views */
import BestDeals from "./InappViews/bestdeals";
import InMenu from "./InappViews/inMen";
import Graph from "./InappViews/Graph";
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
  otherauth(){
    this.setState({
      bundle: 2,
    });
  }
  auth() {
    return (
      <Switch>
      <Route
          exact
          path="/"
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
              </div>{" "}
            </div>
          )}
        />{" "}
          <Route path ='/:ticker' render={(props) => 
        <div >
            <Graph {...props}/>
        </div>
    }/>
        <Route component={NotFoundRedirect} />{" "}
      </Switch>
    );
  }
  render() {
    const login = this.auth();
    return (
      <Router>
        <div className="myroot"> {login} </div>{" "}
      </Router>
    );
  }
}
export default withRouter(App);
