import React, { Component } from "react";
import axios from "axios";
import Moment from "react-moment";

import {
  CheckBox,
  Button,
  Image,
  Grid,
  Card,
  Dropdown,
  Menu,
  Header,
  Form,
  Input,
  Icon,
  Segment,
  Container,
  Label,
  Divider,
  List,
  Popup,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
let endpoint = "http://35.227.147.196:8080/";
class Artist extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateCount = this.updateCount.bind(this);
  }

  updateCount = () => {
    let performance_id = this.props.id;
    axios
      .post(
        endpoint + "auth/api/count",
        {
          performance_id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        // if fails indicate to user that the performance upload failed
        if (res.status === 200) {
          //console.log(this.props);
          this.props.updateState(this.props.id);
        }
      });
  };

  handleChange = (e, { value }) => {
    this.setState({ carYear: value });
    this.props.stateLink(this.props.identifier, this.state);
  };
  // Later fix encode the id in the url variable parameter so it looks nicer
  // The link from the View more info should be a variable link later...
  render() {
    return (
      <Card style={{ marginLeft: "43px", width: "367px", height: "600px" }}>
        <Image
          src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
          wrapped
          ui={false}
        />
        <Card.Header as="h3"> {this.props.name} </Card.Header>
        <Card.Content>
          <Card.Meta>{this.props.info}</Card.Meta>
        </Card.Content>
        <Divider section style={{ marginTop: "0px", marginBottom: "0px" }} />
        <Button
          style={{
            paddingLeft: "16px",
            paddingTop: "13px",
            paddingBottom: "13px",
            paddingRight: "16px",
            marginLeft: "24px",
            marginTop: "15px",
            marginRight: "24px",
            marginBottom: "16px",
            width: "319px",
            height: "42px",
            background: "#f47373",
            color: "#FFFFFF",
          }}
        >
          {" "}
          Learn More{" "}
        </Button>
      </Card>
    );
  }
}
export default Artist;
