import React, { Component } from "react";
import axios from "axios";
import {
  Image,
  Grid,
  Card,
  Header,
  Form,
  Input,
  Icon,
  Button,
  Table,
  Segment,
  List,
  Container,
} from "semantic-ui-react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Artist from "./order_prim";
let endpoint = "http://35.227.147.196:8080/";
const gridoffset = {
  marginTop: "19.5px",
  textAlign: "center",
  fontFamily: "	OverpassSemiBold",
  background: "#F6F7F6",
  paddingBottom: "40px",
  width: "1366px",
};

const tableStyle = {
  width: "601px",
  height: "57px",
  marginLeft: "42.5px",
  marginRight: "722.5",
};
const rightTable = {
  color: "#595959",
  fontFamily: "Rubik",
  fontSize: "16px",
  letterSpacing: "0.57px",
  lineHeight: "19px",
  textAlign: "center",
};
class Artists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "active",
      auth: true,
    };
    this.join = this.join.bind(this);
    this.updateView = this.updateView.bind(this);
    this.cancelView = this.cancelView.bind(this);
    this.activeView = this.activeView.bind(this);
  }
  componentDidMount() {
    this.getArtists();
  }
  getArtists = () => {
    ////console.log("called the function")
    axios
      .get(endpoint + "auth/api/fetchartists", {
        withCredentials: true,
      })
      .then((res) => {
        ////console.log(res);
        if (res.data) {
          this.setState({
            types: res.data.map((performance) => {
              return (
                <Artist
                  updateState={this.updateState}
                  info={performance.bio}
                  name={performance.fullname}
                  id={performance._id}
                />
              );
            }),
          });
        } else {
          this.setState({
            types: [],
          });
        }
      });
  };
  updateEmail = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ email: value.target.value });
    ////console.log(value.target.value)
  };
  updateView() {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ view: "all" });
  }
  cancelView() {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ view: "cancel" });
  }
  activeView() {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ view: "active" });
  }
  join() {
    // this function makes a call to our backend with the current email in the box
    // TODO call the backend from here
    ////console.log(this.state["email"])
  }
  sendData(data) {
    this.props.buttonClick(data);
  }
  render() {
    return (
      <Grid fluid divided="vertically" style={gridoffset}>
        <Grid.Row columns={1}>
          <Grid.Row columns={1} stretched>
            <Grid.Column>
              <Card.Group>{this.state.types}</Card.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid.Row>
      </Grid>
    );
  }
}
export default Artists;
