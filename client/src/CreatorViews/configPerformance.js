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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
let endpoint = "http://35.227.147.196:8080/";
const gridoffset = {
  marginTop: "32px",
  fontFamily: "	OverpassSemiBold",
  background: "#F6F7F6",
  paddingBottom: "40px",
  width: "1366px",
};
const friendOptions = [
  {
    key: "30",
    text: "30",
    value: "30",
    image: { avatar: true, src: "/images/avatar/small/jenny.jpg" },
  },
  {
    key: "60",
    text: "60",
    value: "60",
    image: { avatar: true, src: "/images/avatar/small/elliot.jpg" },
  },
  {
    key: "90",
    text: "90",
    value: "90",
    image: { avatar: true, src: "/images/avatar/small/stevie.jpg" },
  },
  {
    key: "120",
    text: "120",
    value: "120",
    image: { avatar: true, src: "/images/avatar/small/christian.jpg" },
  },
];
class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //cars:[<Car identifier={0} stateLink={this.updateState.bind(this)} />],
      types: [],
      auth: true,
      startDate: new Date(),
    };
  }
  handleChange = (date) => {
    this.setState({
      startDate: date,
    });
  };
  onZChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ zoom: value.target.value });
  };
  onPChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ performance: value.target.value });
  };
  onMChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ merch: value.target.value });
  };
  onGChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ goal: value.target.value });
  };
  onSocialChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    ////console.log(value.target.name, "SOCIAL");
    if (value.target.name === "facebook") {
      this.setState({ facebook: value.target.value });
    } else if (value.target.name === "twitter") {
      this.setState({ twitter: value.target.value });
    } else if (value.target.name === "instagram") {
      this.setState({ insta: value.target.value });
    } else if (value.target.name === "youtube") {
      this.setState({ youtube: value.target.value });
    } else if (value.target.name === "paypal") {
      this.setState({ paypal: value.target.value });
    }
  };
  componentDidMount() {
    this.getPreferences();
  }
  updatePref = () => {
    //////console.log(66)
    let zoom = this.state.zoom;
    let performance = this.state.performance;
    let merch = this.state.merch;
    let goal = this.state.goal;
    let facebook = this.state.facebook;
    let youtube = this.state.youtube;
    let insta = this.state.insta;
    let twitter = this.state.twitter;
    let paypal = this.state.paypal;
    let date = this.state.startDate;
    let performance_id = this.props.match.params.id;
    let artistbio = this.state.bio;
    let fullname = this.state.fullname;
    ////console.log("MY BIO IS <<<<",artistbio);
    axios
      .post(
        endpoint + "auth/api/configupdate",
        {
          zoom,
          performance,
          merch,
          goal,
          facebook,
          youtube,
          insta,
          twitter,
          paypal,
          date,
          performance_id,
          artistbio,
          fullname,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          //TODO fix this eventually
          alert("Updated Succedeed");
        }
      });
  };
  getPreferences = () => {
    let performance_id = this.props.match.params.id;
    axios
      .post(
        endpoint + "auth/api/configfetch",
        { performance_id },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        //TODO need to set the date properly
        ////console.log(res);
        this.setState({
          facebook: res.data.facebook,
          twitter: res.data.twitter,
          youtube: res.data.youtube,
          insta: res.data.insta,
          paypal: res.data.paypal,
          zoom: res.data.zoomurl,
          merch: res.data.merch,
          goal: res.data.goal,
          performance: res.data.name,
          fullname: res.data.fullname,
          bio: res.data.bio,
        });
      });
  };
  sendData(data) {
    this.props.buttonClick(data);
  }
  setButton = (e, data) => {
    // access to e.target here
    //////console.log(data,data.index);
    const fav = this.state.favorites.slice();
    fav[data.index][1] = !fav[data.index][1];
    this.setState({ favorites: fav });
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
                  width: "350px",
                  height: "35px",
                }}
                class="edit-profile"
              >
                Edit Performance Configuration
              </h1>
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
                  <Form.Field style={{ marginTop: "0px" }}>
                    <div
                      class="email-address"
                      style={{ marginBottom: "6.5px", marginLeft: "10px" }}
                    >
                      Zoom Invitation:
                    </div>
                    <Form.Input
                      error={this.state.errZoom}
                      value={this.state.zoom}
                      onChange={this.onZChange}
                      style={{
                        color: "#595959",
                        fontFamily: "Rubik",
                        fontSize: "13px",
                        letterSpacing: ".46px",
                        lineHeight: "17px",
                        marginRight: "21px",
                        marginLeft: "10px",
                        width: "607px",
                        marginBottom: "0px",
                      }}
                    />
                  </Form.Field>
                  <Form.Field style={{ marginTop: "16px" }}>
                    <div
                      class="email-address"
                      style={{ marginBottom: "6.5px", marginLeft: "10px" }}
                    >
                      Performance name
                    </div>
                    <Form.Input
                      error={this.state.errPerformance}
                      value={this.state.performance}
                      onChange={this.onPChange}
                      style={{
                        color: "#595959",
                        fontFamily: "Rubik",
                        fontSize: "13px",
                        letterSpacing: ".46px",
                        lineHeight: "17px",
                        marginRight: "21px",
                        marginLeft: "10px",
                        width: "607px",
                        marginBottom: "0px",
                      }}
                    />
                  </Form.Field>
                  <Form.Field
                    style={{ marginLeft: "10px" }}
                    error={this.state.errDate}
                  >
                    <div
                      class="email-address"
                      style={{ marginBottom: "2.5px" }}
                    >
                      Date of Performance
                    </div>
                    <DatePicker
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={20}
                      timeCaption="time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      style={{ marginRight: "3.5px" }}
                      selected={this.state.startDate}
                      onChange={this.handleChange}
                    ></DatePicker>
                  </Form.Field>
                  <Form.Field>
                    <div
                      class="email-address"
                      style={{ marginBottom: "6.5px", marginLeft: "10px" }}
                    >
                      Merchandise Link
                    </div>
                    <Form.Input
                      error={this.state.errMerch}
                      value={this.state.merch}
                      onChange={this.onMChange}
                      style={{
                        color: "#595959",
                        fontFamily: "Rubik",
                        fontSize: "13px",
                        letterSpacing: ".46px",
                        lineHeight: "17px",
                        marginRight: "21px",
                        marginLeft: "10px",
                        width: "607px",
                        marginBottom: "0px",
                      }}
                    />
                  </Form.Field>
                  <Form.Field>
                    <div
                      class="email-address"
                      style={{ marginBottom: "6.5px", marginLeft: "10px" }}
                    >
                      Support Goal
                    </div>
                    <Form.Input
                      error={this.state.errGoal}
                      value={this.state.goal}
                      onChange={this.onGChange}
                      style={{
                        color: "#595959",
                        fontFamily: "Rubik",
                        fontSize: "13px",
                        letterSpacing: ".46px",
                        lineHeight: "17px",
                        marginRight: "21px",
                        marginLeft: "10px",
                        width: "607px",
                        marginBottom: "0px",
                      }}
                    />
                  </Form.Field>
                </Form>
              </Card>
              <Form style={{ marginLeft: "46px", width: "372px" }}>
                <Form.Field>
                  <div style={{ marginBottom: "7.5px" }} class="email-address">
                    Verify your current username to save changes
                  </div>
                  <input />
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
                  marginTop: "50px",
                  marginLeft: "16px",
                  marginRight: "29px",
                  width: "637px",
                  marginBottom: "0px",
                  height: "268px",
                }}
              >
                <Form
                  style={{
                    marginLeft: "24px",
                    marginTop: "16px",
                    marginBottom: "16.5px",
                  }}
                >
                  <Form>
                    <Form.Group style={{ marginRight: "10px" }} widths="equal">
                      <Form.Input
                        fluid
                        name="facebook"
                        label="Facebook"
                        placeholder="https://www.facebook.com"
                        error={this.state.errBook}
                        value={this.state.facebook}
                        onChange={this.onSocialChange}
                      />
                      <Form.Input
                        fluid
                        name="instagram"
                        label="Instagram"
                        placeholder="https://www.instagram.com"
                        error={this.state.errInsta}
                        value={this.state.insta}
                        onChange={this.onSocialChange}
                      />
                    </Form.Group>
                    <Form.Group style={{ marginRight: "10px" }} widths="equal">
                      <Form.Input
                        fluid
                        name="twitter"
                        label="Twitter"
                        placeholder="https://www.twitter.com"
                        error={this.state.errTwitter}
                        value={this.state.twitter}
                        onChange={this.onSocialChange}
                      />

                      <Form.Input
                        fluid
                        name="youtube"
                        label="Youtube"
                        placeholder="https://www.youtube.com"
                        error={this.state.errYou}
                        value={this.state.youtube}
                        onChange={this.onSocialChange}
                      />
                    </Form.Group>
                    <div style={{ marginRight: "10px" }}>
                      <Form.Input
                        fluid
                        name="paypal"
                        label="Paypal Link"
                        placeholder="https://www.paypal.com"
                        error={this.state.errPay}
                        value={this.state.paypal}
                        onChange={this.onSocialChange}
                      />
                    </div>
                  </Form>
                </Form>
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
                      label="Yes, I would like Tour to contact me about performances and other
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
                  <span class="ending-card">
                    Ending in 0001 ( Not supported yet ){" "}
                  </span>
                </Card.Description>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
export default Config;
