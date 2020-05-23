import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Image,
  Menu,
  Button,
  Portal,
  Header,
  Card,
  Form,
  Input,
  Divider,
  Icon,
} from "semantic-ui-react";
import validator from "validator";
import myImage from "./touring.png";

let endpoint = "http://35.227.147.196:8080/";

const mynav = {
  background: "inherit",
  height: "75%",
  color: "#f47373",
  fontFamily: "Overpass",
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "25px",
  boxShadow: "none",
  border: "none",
};
// since menu has 10 margin
const form_formatting = {
  marginLeft: "36px",
  marginRight: "32px",
  marginTop: "25px",
};
const pref_formatting = {
  marginLeft: "37px",
  marginRight: "20px",
  marginTop: "45px",
};

const submit = {
  marginRight: "519px",
  marginBottom: "42px",
  background: "#f47373",
};
const navbar = {
  color: "#f47373",
  fontFamily: "Overpass",
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "25px",
  marginLeft: "100px",
};
const greenBut = {
  background: "#f47373",
  color: "white",
};
const lip = {
  color: "#f47373",
};
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "register",
      email: "",
      name: "",
      username: "",
      Location: "",
      buyer: false,
      seller: false,
      // TEMPORARY FOR DEV LINK this with whatever page needs it?
      emailOpen: false,
      // TODO set these to the correct default values
      errEmail: false,
      errName: false,
      errUsername: false,
      // not answering these is acceptable
      // errLumber: false,
      // errLength: false,
      errLoc: false,
      errSubmit: false,
      errSeller: false,
      errBuyer: false,

      favorites: [
        ["Hip-Hop", false],
        ["Pop", false],
        ["Alternative", false],
        ["Indie", false],
      ],
      //["Spruce",false],["Pine",false],["Fir",false],["Cedar",false],["Other",false]],
      lengths: [
        ["15", false],
        ["30", false],
        ["60", false],
        ["90", false],
        ["120", false],
        ["Other", false],
      ],
    };
    this.loadCard = this.loadCard.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.setLumStyle = this.setLumStyle.bind(this);
    this.setLenStyle = this.setLenStyle.bind(this);
    this.setButton = this.setButton.bind(this);
    this.closeEmail = this.closeEmail.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.switchRegister = this.switchRegister.bind(this);
    this.validateLoginForm = this.validateLoginForm.bind(this);
    this.loginBackendUser = this.loginBackendUser.bind(this);
  }
  registerUser = () => {
    let email = this.state.email;
    let name = this.state.username;
    let buyer = this.state.value === "artist";
    let lumber = this.state.favorites;
    let length = this.state.lengths;
    let fullname = this.state.fullName;
    let artistbio = this.state.info;
    if (this.state.value === "artist") {
      lumber = [];
      length = [];
    }
    axios
      .post(
        endpoint + "api/register",
        {
          email,
          name,
          buyer,
          lumber,
          length,
          fullname,
          artistbio,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          this.setState({ emailOpen: true });
          ////console.log(res);
        }
      });
  };
  onEChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ email: value.target.value });
  };
  onLChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ Location: value.target.value });
  };
  onIChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ info: value.target.value });
  };
  onNChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ fullName: value.target.value });
  };
  onUChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ username: value.target.value });
  };
  onStrengthChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    if (value) {
      ////console.log(value)
      this.setState({ passwordStrength: value });
    }
  };
  onTypeChange = (e, { value }) => this.setState({ value });

  checkPass(x) {
    if (x.length > 1) {
      return true;
    }
    return false;
  }
  loadNext() {
    this.setState({ activeItem: "prefer" });
  }
  validateLoginForm() {
    // this function makes a call to our backend with the current email in the box
    // TODO call the backend from here
    //console.log(11);
    var validated = true;
    if (!this.state["email"]) {
      validated = false;
      this.setState({
        errEmail: true,
      });
    }
    //console.log(22);
    if (!this.state["username"]) {
      validated = false;
      this.setState({
        errUsername: true,
      });
    }
    if (validated) {
      //console.log(36);
      var response = this.loginBackendUser();
      // if token not valid
      // if response not valid throw an error on the page
    }
  }
  loginBackendUser = () => {
    let email = this.state.email;
    let username = this.state.username;
    var errUsername = false;
    var errEmail = false;
    axios
      .post(
        endpoint + "api/login",
        {
          email,
          username,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        //console.log(res);
        if (res.status === 200) {
          if (res.data) {
            this.props.history.push("creator");
          } else {
            this.props.history.push("feed");
          }
        } else {
        }
      })
      .catch(function (error) {});
  };
  validateForm() {
    // this function makes a call to our backend with the current email in the box
    // TODO call the backend from here
    var validated = true;
    if (!validator.isEmail(this.state.email)) {
      validated = false;
      this.setState({
        errEmail: true,
      });
    }
    if (!this.state["username"]) {
      validated = false;
      this.setState({
        errUsername: true,
      });
    }
    if (this.state["Location"].length === 0) {
      validated = false;
      this.setState({
        errLoc: true,
      });
    }
    if (this.state.value === "artist" && !this.state.fullName) {
      validated = false;
      this.setState({
        errFullName: true,
      });
    }
    if (this.state.value === "artist" && !this.state.info) {
      validated = false;
      this.setState({
        errInfo: true,
      });
    }
    if (!this.state.value) {
      validated = false;
      this.setState({
        errLength: true,
      });
    }
    if (validated) {
      var response = this.registerUser();
      // if token not valid
      // if response not valid throw an error on the page
      this.setState({
        open: false,
      });
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  handleClose = () => {
    this.setState({ open: false });
  };
  closeEmail = () => {
    this.setState({ emailOpen: false });
  };
  setButton = (e, data) => {
    // access to e.target here
    ////console.log(data,data.index);
    if (data.type == "lum") {
      const fav = this.state.favorites.slice();
      fav[data.index][1] = !fav[data.index][1];
      this.setState({ favorites: fav });
    } else {
      const len = this.state.lengths.slice();
      len[data.index][1] = !len[data.index][1];
      this.setState({ lengths: len });
    }
  };
  loginUser() {
    this.setState({ activeItem: "login" });
  }
  switchRegister() {
    this.setState({ activeItem: "register" });
  }
  setLumStyle() {
    //TODO ensure first guys margin is effectively 24
    const favorites = this.state.favorites;
    var result = [];
    for (var i = 0; i < favorites.length; ++i) {
      var margin_left = i == 0 || i == 6 ? "2px" : "16px";
      var margin_right = i == 5 ? "50px" : "0px";

      ////console.log(favorites[i][1])
      if (favorites[i][1]) {
        result.push(
          <Button
            style={{
              marginLeft: margin_left,
              marginRight: margin_right,
              marginBottom: "16px",
              height: "36px",
              background: "#0F4210",
            }}
            index={i}
            type={"lum"}
            onClick={this.setButton}
            className="cho-reg-choices"
            icon="check circle outline"
            content={favorites[i][0]}
          />
        );
      } else {
        result.push(
          <Button
            style={{
              marginLeft: margin_left,
              marginRight: margin_right,
              marginBottom: "16px",
              height: "36px",
              background: "#FFFFFF",
            }}
            index={i}
            type={"lum"}
            onClick={this.setButton}
            className="reg-choices"
            content={favorites[i][0]}
          />
        );
      }
    }
    return result;
  }
  setLenStyle() {
    //TODO ensure first guys margin is effectively 24
    const favorites = this.state.lengths;
    var result = [];
    for (var i = 0; i < favorites.length; ++i) {
      var margin_left = i == 0 ? "2px" : "16px";
      if (favorites[i][1]) {
        result.push(
          <Button
            style={{
              marginLeft: margin_left,
              marginBottom: "16px",
              height: "36px",
              background: "#0F4210",
            }}
            index={i}
            onClick={this.setButton}
            className="cho-reg-choices"
            icon="check circle outline"
            content={favorites[i][0]}
          />
        );
      } else {
        result.push(
          <Button
            style={{
              marginLeft: margin_left,
              marginBottom: "16px",
              height: "36px",
              background: "#FFFFFF",
            }}
            index={i}
            onClick={this.setButton}
            className="reg-choices"
            content={favorites[i][0]}
          />
        );
      }
    }
    return result;
  }
  loadCard() {
    ////console.log(this.state.activeItem)
    if (this.state.activeItem === "register") {
      return (
        <Form style={form_formatting}>
          <Form.Field style={{ marginTop: "0px" }}>
            <div class="email-address" style={{ marginBottom: "6.5px" }}>
              Email Address:
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
                marginBottom: "16px",
              }}
            />
          </Form.Field>
          <Form.Field style={{ marginTop: "16px", marginBottom: "0px" }}>
            <div class="email-address" style={{ marginBottom: "6.5px" }}>
              Username{" "}
            </div>
            <Form.Input
              error={this.state.errUsername}
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
              }}
            />
          </Form.Field>
          <Form.Field style={{ marginTop: "16px" }}>
            <div class="email-address" style={{ marginBottom: "6.5px" }}>
              Location
            </div>
            <Form.Input
              error={this.state.errLoc}
              value={this.state.Location}
              onChange={this.onLChange}
              style={{
                color: "#595959",
                fontFamily: "Rubik",
                fontSize: "13px",
                letterSpacing: ".46px",
                lineHeight: "17px",
                marginRight: "21px",
                width: "607px",
                marginBottom: "23.5px",
              }}
            />
          </Form.Field>
          <Form.Button
            color="blue"
            size="large"
            style={submit}
            onClick={this.loadNext}
          >
            <div className="button-text">NEXT</div>
          </Form.Button>
        </Form>
      );
    } else if (this.state.activeItem === "login") {
      return (
        <Form style={form_formatting}>
          <Form.Field style={{ marginTop: "0px" }}>
            <div class="email-address" style={{ marginBottom: "6.5px" }}>
              Email Address:
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
                marginBottom: "16px",
              }}
            />
          </Form.Field>
          <Form.Field style={{ marginTop: "16px", marginBottom: "0px" }}>
            <div class="email-address" style={{ marginBottom: "6.5px" }}>
              Username
            </div>
            <Form.Input
              error={this.state.errUsername}
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
              }}
            />
          </Form.Field>
          <Form.Button
            color="blue"
            size="large"
            style={{
              marginRight: "519px",
              marginTop: "22px",
              marginBottom: "42px",
              background: "#f47373",
            }}
            onClick={this.validateLoginForm}
          >
            <div className="button-text">LOGIN</div>
          </Form.Button>
        </Form>
      );
    }
    return (
      <Form style={pref_formatting}>
        <Form.Group widths="equal" inline style={{ marginLeft: "3px" }}>
          <Form.Input error={this.state.errBuyer}>
            <Form.Checkbox
              radio
              name={"buyer"}
              value={"artist"}
              checked={this.state.value === "artist"}
              onChange={this.onTypeChange}
              label="Artist"
            />
          </Form.Input>
          <Form.Input error={this.state.errSeller}>
            <Form.Checkbox
              radio
              name={"seller"}
              value={"fan"}
              checked={this.state.value === "fan"}
              onChange={this.onTypeChange}
              label="Fan"
            />
          </Form.Input>
        </Form.Group>
        {this.loadOptions()}
        <Button
          className="button-text"
          style={{
            width: "120px",
            height: "42px",
            marginLeft: "0px",
            marginTop: "2px",
            marginBottom: "16px",
          }}
          onClick={this.validateForm}
          content="REGISTER"
        ></Button>
        <Card.Content>
          <div
            style={{ marginLeft: "4px", marginBottom: "18px" }}
            className="register"
          >
            By clicking Register, you agree to our{" "}
            <Link style={{ color: "#f47373" }}>
              Terms of Use and Privacy Policy
            </Link>
          </div>
        </Card.Content>
      </Form>
    );
  }
  loadBottom() {
    if (this.state.activeItem != "login") {
      return (
        <div style={{ display: "flex", height: "55px" }}>
          <div class="sign-in">
            {" "}
            Already have an account?{" "}
            <Link to="/" onClick={this.loginUser} style={{ color: "#f47373" }}>
              <u>Sign in</u>
            </Link>
          </div>
          <Button
            floated="right"
            size="large"
            style={{
              background: "#FFFFFF",
              float: "right",
              height: "42px",
              width: "120px",
              marginBottom: "13px",
              boxShadow: "0 2px 3px 0 rgba(0,0,0,0.2)",
            }}
            onClick={this.handleClose}
          >
            <div className="button-text" style={{ color: "#f47373" }}>
              CANCEL
            </div>
          </Button>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", height: "55px" }}>
        <div class="sign-in">
          {" "}
          Already have an account?{" "}
          <Link
            to="/"
            onClick={this.switchRegister}
            style={{ color: "#f47373" }}
          >
            <u>Register</u>
          </Link>
        </div>
        <Button
          floated="right"
          size="large"
          style={{
            background: "#FFFFFF",
            float: "right",
            height: "42px",
            width: "120px",
            marginBottom: "13px",
            boxShadow: "0 2px 3px 0 rgba(0,0,0,0.2)",
          }}
          onClick={this.handleClose}
        >
          <div className="button-text" style={{ color: "#f47373" }}>
            CANCEL
          </div>
        </Button>
      </div>
    );
  }
  loadMenu() {
    if (this.state.activeItem === "login") {
      return (
        <Menu
          className="menu-text"
          fluid
          widths={1}
          size={"massive"}
          style={{ height: "60px", marginBottom: "0px" }}
        >
          <Menu.Item className="menu-text" name="register">
            {" "}
            Login{" "}
          </Menu.Item>
        </Menu>
      );
    }
    return (
      <Menu
        className="menu-text"
        fluid
        widths={2}
        size={"massive"}
        style={{ height: "60px", marginBottom: "0px" }}
      >
        <Menu.Item
          className="menu-text"
          name="register"
          onClick={this.handleItemClick}
          active={this.state.activeItem == "register"}
        >
          Register (1 of 2 steps)
        </Menu.Item>
        <Menu.Item
          className="menu-text"
          name="prefer"
          onClick={this.handleItemClick}
          active={this.state.activeItem == "prefer"}
        >
          Preference (2 of 2 steps)
        </Menu.Item>
      </Menu>
    );
  }
  loadOptions() {
    let return_lum = this.setLumStyle();
    let return_len = this.setLenStyle();
    if (this.state.value === "artist") {
      return (
        <div>
          <Form.Field style={{ marginTop: "16px", marginBottom: "0px" }}>
            <div class="email-address" style={{ marginBottom: "6.5px" }}>
              Full Name
            </div>
            <Form.Input
              error={this.state.errFullName}
              value={this.state.fullName}
              onChange={this.onNChange}
              style={{
                color: "#595959",
                fontFamily: "Rubik",
                fontSize: "13px",
                letterSpacing: ".46px",
                lineHeight: "17px",
                marginRight: "21px",
                width: "607px",
              }}
            />
          </Form.Field>
          <Form.TextArea
            error={this.state.errInfo}
            value={this.state.info}
            onChange={this.onIChange}
            label="About"
            placeholder="Write your bio for your fans to see"
          />
        </div>
      );
    } else {
      return (
        <div>
          <Form.Field style={{ marginTop: "16px", marginLeft: "3px" }}>
            <div class="email-address" style={{ marginBottom: "6.5px" }}>
              Favorite Genres:
            </div>
            {return_lum}
          </Form.Field>{" "}
          <Form.Field style={{ marginTop: "16px" }}>
            <div class="email-address" style={{ marginBottom: "6.5px" }}>
              Favorite Concert Lengths:
            </div>
            {return_len}
          </Form.Field>{" "}
        </div>
      );
    }
  }
  render() {
    // FOR NOW FOR TESTING
    let displaycard = this.loadCard();
    let bottomcard = this.loadBottom();
    let myMenu = this.loadMenu();

    return (
      <div className="NavBar">
        <Menu style={mynav} borderless={true}>
          <Menu.Item style={navbar} className=".ui.table">
            <Link to={"/"} style={lip}>
              <Image src={myImage} size="tiny" />
            </Link>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item style={navbar}>Contact</Menu.Item>
            <Menu.Item header>
              <Portal
                closeOnTriggerClick
                openOnTriggerClick
                trigger={<Button content="Login/Sign In" style={greenBut} />}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                open={this.state.open}
              >
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    left: "0px",
                    position: "fixed",
                    top: "0px",
                    background: "rgba(0,0,0,0.5)",
                    zIndex: 1,
                    overflowX: "hidden",
                  }}
                >
                  <Card
                    style={{
                      height: "509px",
                      width: "707px",
                      marginLeft: "399px",
                      marginRight: "362.5px",
                      position: "relative",
                      top: "100px",
                      background: "#F6F7F6",
                      zIndex: 1,
                    }}
                  >
                    {myMenu}
                    {displaycard}
                    <Divider
                      style={{ marginTop: "0px", marginBottom: "5px" }}
                    />
                    {bottomcard}
                  </Card>
                </div>
              </Portal>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Portal open={this.state.emailOpen}>
          <div
            style={{
              height: "100%",
              width: "100%",
              left: "0px",
              position: "fixed",
              top: "0px",
              background: "rgba(0,0,0,0.5)",
              zIndex: 1,
              overflowX: "hidden",
            }}
          >
            <Card
              style={{
                height: "326px",
                width: "403px",
                marginLeft: "519px",
                marginRight: "518px",
                position: "relative",
                top: "196px",
                background: "#FFFFFF",
                zIndex: 1,
              }}
            >
              <Icon
                style={{
                  color: "#AAAAAA",
                  marginLeft: "40px",
                  marginRight: "346px",
                  marginTop: "27px",
                }}
                size={"small"}
                name="close"
              />
              <Icon
                onClick={this.closeEmail}
                style={{
                  color: "#AAAAAA",
                  marginLeft: "167px",
                  marginRight: "166px",
                  marginTop: "22px",
                }}
                size={"huge"}
                name="mail outline"
              />
              <div className="email-head">We sent you an email!</div>
              <div className="email-text">
                You succesfully registered and can now login to Tour! Note that
                you'll have to click the login button again to do so!
              </div>
              <Button
                className="button-text"
                style={{
                  width: "96px",
                  height: "36px",
                  marginLeft: "150px",
                  marginRight: "157px",
                  marginTop: "2px",
                  marginBottom: "12px",
                  paddingRight: "16px",
                  paddingLeft: "16px",
                }}
                onClick={this.closeEmail}
              >
                <div className="email-but">GOT IT</div>
              </Button>
            </Card>
          </div>
        </Portal>
      </div>
    );
  }
}

export default NavBar;
