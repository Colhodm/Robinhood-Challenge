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
  Feed,
} from "semantic-ui-react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Type from "./lumtype";
import Background from "./otherconcert.jpg";
let endpoint = "http://35.227.147.196:8080/";
const gridoffset = {
  marginTop: "19.5px",
  textAlign: "center",
  fontFamily: "Lato",
  background: "#F6F7F6",
  paddingBottom: "0px",
  width: "1465px",
  height: "800px",
  backgroundImage: `url(${Background})`,
};
class Stream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //cars:[<Car identifier={0} stateLink={this.updateState.bind(this)} />],
      types: [],
      streamData: {
        zoomurl: "loading",
        viewers: 0,
        artist: "The artist",
        donations: 0,
        goal: 0,
        storeurl: "http://www.artisttourbus.com",
        paypal: "http://www.paypal.com",
        facebook: "http://www.facebook.com",
        twitter: "http://www.twitter.com",
        instagram: "http://www.instagram.com",
        donators: 0,
        merch: "http://www.artisttourbus.com",
      },
    };
    this.join = this.join.bind(this);
  }
  componentDidMount() {
    this.getPerformance();
  }
  getPerformance = () => {
    let performance_id = this.props.match.params.id;
    axios
      .post(
        endpoint + "auth/api/watch",
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
          ////console.log(res.data);
          this.setState({
            streamData: Object.assign({}, this.state.streamData, res.data),
          });
        }
      });
  };
  updatePerformance = () => {
    axios
      .get(endpoint + "auth/api/updateperformance", {
        withCredentials: true,
      })
      .then((res) => {
        //////console.log(res);
        if (res.data) {
          this.setState({
            types: res.data.map((performance) => {
              return (
                <Type
                  date={performance.date}
                  name={performance.name}
                  url={performance.zoomurl}
                  id={performance._id}
                />
              );
            }),
          });
        } else {
          this.setState({
            types: [<Type />],
          });
        }
      });
  };
  updateEmail = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ email: value.target.value });
    //////console.log(value.target.value)
  };
  join() {
    // this function makes a call to our backend with the current email in the box
    // TODO call the backend from here
    //////console.log(this.state["email"])
  }
  sendData(data) {
    this.props.buttonClick(data);
  }
  render() {
    return (
      <div>
        <Grid divided="vertically" style={gridoffset}>
          <Grid.Row columns={2}>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Card
                  style={{
                    marginLeft: "43px",
                    width: "420px",
                    fontFamily: "Lato",
                  }}
                >
                  <Card.Content>
                    <Card.Header style={{ fontFamily: "Lato" }}>
                      Zoom link is {this.state.streamData.zoomurl}
                    </Card.Header>
                    <Card.Meta style={{ fontFamily: "Lato" }}>
                      There are currently {this.state.streamData.count} people
                      watching
                    </Card.Meta>
                    <Card.Description style={{ fontFamily: "Lato" }}>
                      {this.state.streamData.bio}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content style={{ background: "#BA68C8" }}>
                    <a href={this.state.streamData.facebook}>
                      {" "}
                      <Button icon>
                        <Icon inverted name={"facebook"} />{" "}
                      </Button>
                    </a>
                    <a href={this.state.streamData.insta}>
                      {" "}
                      <Button icon name={"insta"}>
                        {" "}
                        <Icon inverted name="instagram" />{" "}
                      </Button>
                    </a>
                    <a href={this.state.streamData.twitter}>
                      {" "}
                      <Button icon name={"twitter"}>
                        {" "}
                        <Icon inverted name="twitter" />{" "}
                      </Button>
                    </a>
                    <a href={this.state.streamData.youtube}>
                      {" "}
                      <Button icon name={"youtube"}>
                        {" "}
                        <Icon inverted name="youtube" />{" "}
                      </Button>
                    </a>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
            <Grid.Column floated={"right"}>
              <Card style={{ marginLeft: "420px" }}>
                <Card.Content>
                  <Card.Header style={{ fontFamily: "Lato" }}>
                    Support
                  </Card.Header>
                  <Card.Meta style={{ fontFamily: "Lato" }}>
                    There has been {this.state.streamData.donators} donations so
                    far with a total amount of {this.state.streamData.donations}
                  </Card.Meta>
                  <Card.Description style={{ fontFamily: "Lato" }}>
                    {this.state.streamData.fullname} is looking to raise around{" "}
                    {this.state.streamData.goal}.
                  </Card.Description>
                  <Card.Description style={{ marginTop: "8px" }}>
                    <a href={this.state.streamData.paypal}>
                      {" "}
                      <Button color={"blue"}>Paypal</Button>
                    </a>
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card style={{ marginLeft: "420px" }}>
                <Card.Content>
                  <Card.Header style={{ fontFamily: "Lato" }}>
                    Buy Merchandise
                  </Card.Header>
                  <Card.Meta style={{ fontFamily: "Lato" }}>
                    <a href={this.state.streamData.merch}>
                      <Button icon name={"merch"}>
                        <Icon name="world" />
                      </Button>
                    </a>
                  </Card.Meta>
                  <Card.Meta style={{ fontFamily: "Lato" }}>
                    {this.state.streamData.artist} released their hottest
                    collection for this signature VIP concert.
                  </Card.Meta>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
export default Stream;
