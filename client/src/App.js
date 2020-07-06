import React, {
  Component
} from "react";
import "./App.css";
import {
  withRouter,
  BrowserRouter as Router,
  Switch,
  Route,

} from "react-router-dom";
/* Fan Views */
import Tickers from "./InappViews/tickers";
import InMenu from "./InappViews/inMen";
import Graph from "./InappViews/Graph";
const NotFoundRedirect = () => < div / > ;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "",
    };
  }
  auth() {
    return ( <
      Switch >
      <
      Route exact path = "/"
      render = {
        (props) => ( <
          div >
          <
          InMenu {
            ...props
          }
          />{" "} <
          div style = {
            {
              marginTop: "0px",
              marginRight: "0px",
              background: "#F6F7F6",
              width: "1450px",
            }
          } >
          <
          Tickers {
            ...props
          }
          sendBundle = {
            this.updateCurrentBundle.bind(this)
          }
          />{" "} <
          /div>{" "} <
          /div>
        )
      }
      />{" "} <
      Route path = '/:ticker'
      render = {
        (props) =>
        <
        div >
        <
        Graph {
          ...props
        }
        /> <
        /div>
      }
      /> <
      Route component = {
        NotFoundRedirect
      }
      />{" "} <
      /Switch>
    );
  }
  render() {
    const login = this.auth();
    return ( <
      Router >
      <
      div className = "myroot" > {
        login
      } < /div>{" "} <
      /Router>
    );
  }
}
export default withRouter(App);