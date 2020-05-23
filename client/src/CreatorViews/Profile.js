import React, { Component } from "react";
import axios from "axios";
import {
  Image,
  Grid,
  Card,
  Checkbox,
  Divider,
  Header,
  Form,
  Input,
  Dropdown,
  Icon,
  Label,
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
let endpoint = "http://35.227.147.196:8080/";
const gridoffset = {
  marginTop: "32px",
  fontFamily: "	OverpassSemiBold",
  background: "#F6F7F6",
  paddingBottom: "40px",
  width: "1366px",
};
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //cars:[<Car identifier={0} stateLink={this.updateState.bind(this)} />],
      types: [],
      auth: true,
    };
    this.join = this.join.bind(this);
    this.setButton = this.setButton.bind(this);
    ////console.log(this.state.favorites)
  }
  componentDidMount() {
    this.getPreferences();
  }
  updatePref = () => {
    let fullname = this.state.name;
    let artistbio = this.state.bio;
    let email = this.state.email;
    let name = this.state.username;
    let buyer = true;
    axios
      .post(
        endpoint + "auth/api/profileupdate",
        { fullname, artistbio, email, name, buyer },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          //TODO come up with some confirmation mechanism and actually verify the password
        }
      });
  };
  getPreferences = () => {
    axios
      .get(endpoint + "auth/api/profilefetch", {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({
          bio: res.data.bio,
          name: res.data.fullname,
          email: res.data.email,
          username: res.data.name,
        });
      });
  };
  updateEmail = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ email: value.target.value });
    ////console.log(value.target.value)
  };
  join() {
    // this function makes a call to our backend with the current email in the box
    // TODO call the backend from here
    ////console.log(this.state["email"])
  }
  sendData(data) {
    this.props.buttonClick(data);
  }
  setButton = (e, data) => {
    // access to e.target here
    ////console.log(data,data.index);
    const fav = this.state.favorites.slice();
    fav[data.index][1] = !fav[data.index][1];
    this.setState({ favorites: fav });
  };
  onEChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ email: value.target.value });
  };
  onUChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ username: value.target.value });
  };
  onNameChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ name: value.target.value });
  };
  onBioChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ bio: value.target.value });
  };
  render() {
    return (
      <div>
        <Grid fluid divided="vertically" style={gridoffset}>
          <Grid.Row columns={2}>
            <Grid.Column>
              <h1
                style={{
                  marginLeft: "46px",
                  marginBottom: "0px",
                  width: "129px",
                  height: "35px",
                }}
                class="edit-profile"
              >
                Edit Profile
              </h1>
              <h2
                style={{ marginLeft: "46px", marginTop: "0px" }}
                class="short-description"
              >
                Short Description
              </h2>
              <Card
                style={{ marginLeft: "46px", width: "637px", height: "467px" }}
              >
                <h1
                  class="details"
                  style={{
                    marginLeft: "10px",
                    marginTop: "16px",
                    marginBottom: "16px",
                  }}
                >
                  Details
                </h1>
                <Form>
                  <Form.Field>
                    <div
                      class="email-address"
                      style={{ marginLeft: "10px", marginBottom: "7.5px" }}
                    >
                      Username:
                    </div>
                    <Form.Input
                      error={this.state.errUser}
                      value={this.state.username}
                      onChange={this.onUChange}
                      style={{
                        color: "#595959",
                        fontFamily: "Rubik",
                        fontSize: "13px",
                        letterSpacing: ".46px",
                        lineHeight: "17px",
                        marginRight: "21px",
                        width: "607px",
                        marginBottom: "0px",
                      }}
                    />
                  </Form.Field>
                  <Form.Field style={{ marginTop: "16px" }}>
                    <div
                      class="email-address"
                      style={{ marginLeft: "10px", marginBottom: "7.5px" }}
                    >
                      Email Address
                    </div>
                    <Form.Input
                      error={this.state.errEmail}
                      value={this.state.email}
                      onChange={this.onEChange}
                      style={{
                        color: "#595959",
                        fontFamily: "Rubik",
                        fontSize: "13px",
                        letterSpacing: ".46px",
                        lineHeight: "17px",
                        marginRight: "21px",
                        width: "607px",
                        marginBottom: "0px",
                      }}
                    />
                  </Form.Field>
                  <Form.Field style={{ marginTop: "16px" }}>
                    <div
                      class="email-address"
                      style={{ marginLeft: "10px", marginBottom: "7.5px" }}
                    >
                      Full Name
                    </div>
                    <Form.Input
                      error={this.state.errName}
                      value={this.state.name}
                      onChange={this.onNameChange}
                      style={{
                        color: "#595959",
                        fontFamily: "Rubik",
                        fontSize: "13px",
                        letterSpacing: ".46px",
                        lineHeight: "17px",
                        marginRight: "21px",
                        width: "607px",
                        marginBottom: "0px",
                      }}
                    />{" "}
                  </Form.Field>
                  <div
                    class="email-address"
                    style={{ marginLeft: "10px", marginBottom: "7.5px" }}
                  >
                    Artist Bio
                  </div>
                  <Form.TextArea
                    value={this.state.bio}
                    onChange={this.onBioChange}
                    style={{
                      marginLeft: "10px",
                      width: "550px",
                      marginTop: "16px",
                      marginBottom: "31px",
                    }}
                  ></Form.TextArea>
                </Form>
              </Card>
              <Form style={{ marginLeft: "46px", width: "372px" }}>
                <Form.Field>
                  <div style={{ marginBottom: "7.5px" }} class="email-address">
                    Verify your current username to save changes
                  </div>
                  <Form.Input
                    style={{
                      color: "#595959",
                      fontFamily: "Rubik",
                      fontSize: "13px",
                      letterSpacing: ".46px",
                      lineHeight: "17px",
                      marginRight: "21px",
                      width: "607px",
                      marginBottom: "0px",
                    }}
                  />{" "}
                </Form.Field>
                <div>
                  <Button onClick={this.updatePref} className="group">
                    SAVE CHANGES
                  </Button>
                  <Button className="cancel">CANCEL </Button>
                </div>
              </Form>
            </Grid.Column>
            <Grid.Column>
              <Card
                style={{
                  marginTop: "84px",
                  marginLeft: "16px",
                  marginRight: "29px",
                  width: "637px",
                  marginBottom: "0px",
                  height: "268px",
                }}
              >
                <Card.Content>
                  <Card.Header>Picture Upload ( Coming Soon )</Card.Header>
                </Card.Content>
              </Card>
              <Card
                style={{
                  marginTop: "16px",
                  marginLeft: "16px",
                  marginRight: "29px",
                  marginBottom: "0px",
                  width: "637px",
                  height: "120px",
                }}
              >
                <div class="email">Email</div>
                <Form>
                  <Form.Field
                    style={{
                      marginLeft: "26px",
                      marginRight: "0px",
                      marginBottom: "39px",
                      width: "613px",
                    }}
                  >
                    <Checkbox
                      style={{ fontSize: "16px", fontHeight: "24px" }}
                      className="terms"
                      label="Yes, I would like Tour to contact me about new bundles and other
                        promotional information"
                    />
                  </Form.Field>
                </Form>
              </Card>
              <Card
                style={{
                  marginTop: "16px",
                  marginLeft: "16px",
                  marginRight: "29px",
                  width: "637px",
                  height: "108px",
                }}
              >
                <div
                  style={{
                    marginTop: "17px",
                    marginLeft: "21px",
                    marginRight: "377px",
                  }}
                >
                  <div class="payment-method">Payment Method </div>{" "}
                  <span class="change-copy"> Change </span>
                </div>
                <Divider style={{ marginTop: "10px", marginBottom: "9px" }} />
                <Card.Description
                  style={{ marginLeft: "32px", marginBottom: "18px" }}
                >
                  <Icon size="large" name="cc visa"></Icon>
                  <span class="ending-card">Ending in 0001</span>
                </Card.Description>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
export default Profile;
