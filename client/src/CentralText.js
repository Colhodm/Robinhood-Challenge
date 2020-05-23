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
} from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

let endpoint = "http://localhost:8080";
const gridoffset = {
  marginTop: "150px",
  textAlign: "center",
  fontFamily: "	OverpassSemiBold",
};
const mybigtext = {
  fontSize: "50px",
  fontWeight: "bold",
};
const mymidtext = {
  fontSize: "20px",
  fontWeight: "lighter",
};
class CentralText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
    this.join = this.join.bind(this);
  }
  updateEmail = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ email: value.target.value });
  };
  join() {
    ////console.log(14)
    let email = this.state.email;
    axios
      .post(
        endpoint + "/api/joinnow",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        ////console.log(res);
      });
  }
  sendData(data) {
    this.props.buttonClick(data);
  }
  render() {
    return (
      <Grid divided="vertically" style={gridoffset}>
        <Grid.Row columns={1}>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Header as="h1" style={mybigtext}>
                Watch your favorite musicians live.
              </Header>
              <Header as="h1" style={mymidtext}>
                Forget about leaving your house, and sit back and enjoy the
                music.
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid.Row>
      </Grid>
    );
  }
}
export default CentralText;
