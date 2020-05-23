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
class Type extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.sendData = this.sendData.bind(this);
  }

  sendData(value) {
    this.props.sendBundle(this.props);
  }
  handleChange = (e, { value }) => {
    this.setState({ carYear: value });
    this.props.stateLink(this.props.identifier, this.state);
  };
  // Later fix encode the id in the url variable parameter so it looks nicer
  // The link from the View more info should be a variable link later...
  render() {
    //console.log(this.props);
    return (
      <Card style={{ marginLeft: "43px", width: "367px", height: "600px" }}>
        <Image
          src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
          wrapped
          ui={false}
        />
        <Card.Header as="h3"> {this.props.name} </Card.Header>
        <Card.Content>
          <Card.Meta>
            <Moment local>{this.props.date}</Moment>
          </Card.Meta>
        </Card.Content>

        <div
          class="lumber-text"
          style={{
            lineHeight: "17px",
            marginLeft: "13px",
            marginTop: "10px",
            marginRight: "36px",
            width: "318px",
            height: "49px",
            textAlign: "left",
          }}
        >
          Selling for
          <div
            style={{
              color: "#GGFFF",
              fontFamily: "Rubik",
              fontSize: "21px",
              fontWeight: "500",
              letterSpacing: ".43px",
              lineHeight: "24px",
            }}
          >
            $ FREE
            <Popup
              className="pop-up"
              content="You save by using Tour"
              trigger={<Icon color={"grey"} name="question circle outline" />}
            />
          </div>
        </div>

        <Divider section style={{ marginTop: "0px", marginBottom: "0px" }} />
        <Link to={`/analytics` + this.props.id}>
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
            Configure{" "}
          </Button>
        </Link>
      </Card>
    );
  }
}
export default Type;
