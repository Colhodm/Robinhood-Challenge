import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Image,
  Menu,
  Button,
  Grid,
  Label,
  Icon,
  List,
} from "semantic-ui-react";
const navbar = {
  color: "#f47373",
  fontFamily: "Overpass",
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "25px",
  marginLeft: "13px",
  marginTop: "0px",
  marginBottom: "0px",
};
const greenBut = {
  height: "86px",
};
const gridS = {
  height: "74px",
  width: "1366px",
};
const tabs = {
  height: "60px",
  width: "206px",
};
// 48 became 32 since padding of menu items
const tabText = {
  width: "109px",
  color: "#595959",
  fontSize: "16px",
  letterSpacing: "0.57px",
  lineHeight: "19px",
  marginTop: "21px",
  marginBottom: "20px",
  textAlign: "center",
};



class InMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: "24", // second for timer
      minutes: "21", // minutes for timer
      hours: "10", // hours for timer
    };
    this.startCountDown = this.startCountDown.bind(this);
    this.tick = this.tick.bind(this);
    this.startCountDown();
    this.setStyle = this.setStyle.bind(this);
  }
  //TODO fix so that will work for hours
  tick() {
    var hour = Math.floor(this.secondsRemaining / (60 * 60));
    var min = Math.floor((this.secondsRemaining - hour * 60 * 60) / 60);
    var sec = this.secondsRemaining - hour * 3600 - min * 60;
    this.setState({
      hours: hour,
      minutes: min,
      seconds: sec,
    });
    if (sec < 10) {
      this.setState({
        seconds: "0" + this.state.seconds,
      });
    }
    if (min < 10) {
      this.setState({
        minutes: "0" + min,
      });
    }
    if (hour < 10) {
      this.setState({
        hours: "0" + hour,
      });
    }
    this.secondsRemaining--;
  }
  startCountDown() {
    this.intervalHandle = setInterval(this.tick, 1000);
    let time = this.state.minutes;
    let hours = this.state.hours;
    let seconds = this.state.seconds;
    this.secondsRemaining = time * 60 + hours * 3600 + seconds * 1;
  }
  setStyle() {
    this.border_lumber_select = {
      borderBottom:
        this.props.location.pathname == "/feed" ? "2px solid #3F691A" : "",
      marginLeft: "32px",
    };
    this.border_profile_select = {
      borderBottom:
        this.props.location.pathname == "/profile" ? "2px solid #3F691A" : "",
      marginLeft: "32px",
    };
    this.border_order_select = {
      borderBottom:
        this.props.location.pathname == "/artists" ? "2px solid #3F691A" : "",
      marginLeft: "32px",
    };
  }
  render() {
    this.setStyle();
    return (
      <div>
        <Grid fluid padded={false} columns={2} style={gridS}>
          <Grid.Row fluid stye={greenBut}>
            <Grid.Column>
              <Link to={"/feed"} style={navbar}>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Menu
          size="none"
          style={{
            marginTop: "19px",
            paddingBottom: "0px",
            boxShadow: "none",
            border: "none",
            marginBottom: "0px",
            height: "60px",
          }}
        >
          <Menu.Item style={tabs}>
            <div style={this.border_lumber_select}>
              <Link to={"/feed"}>
                <div style={tabText}>FEED</div>
              </Link>
            </div>
          </Menu.Item>
  
        </Menu>
      </div>
    );
  }
}

export default InMenu;
