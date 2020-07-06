import React, {
  Component
} from "react";
import {
  Link
} from "react-router-dom";
import {
  Menu,
  Grid
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
    this.state = {};
  }
  render() {
    return ( <
      div >
      <
      Grid fluid padded = {
        false
      }
      columns = {
        2
      }
      style = {
        gridS
      } >
      <
      Grid.Row fluid stye = {
        greenBut
      } >
      <
      Grid.Column >
      <
      Link to = {
        "/feed"
      }
      style = {
        navbar
      } >
      <
      /Link> <
      /Grid.Column> <
      /Grid.Row> <
      /Grid> <
      Menu size = "none"
      style = {
        {
          marginTop: "19px",
          paddingBottom: "0px",
          boxShadow: "none",
          border: "none",
          marginBottom: "0px",
          height: "60px",
        }
      } >
      <
      Menu.Item style = {
        tabs
      } >
      <
      div style = {
        this.border_lumber_select
      } >
      <
      Link to = {
        "/feed"
      } >
      <
      div style = {
        tabText
      } > FEED < /div> <
      /Link> <
      /div> <
      /Menu.Item>

      <
      /Menu> <
      /div>
    );
  }
}

export default InMenu;