import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Container, Image, Menu,Button, Grid,Label,Icon,List  } from 'semantic-ui-react';
const mynav = {
    background: "inherit",
    height: "75%",
    color: "#759E33",
    fontFamily: "Overpass",	
    fontSize: "16px",	
    fontWeight: 600,
    lineHeight: "25px",
    
};
const navbar = {
  color: "#759E33",
  fontFamily: "Overpass",	
  fontSize: "16px",	
  fontWeight: 600,
  lineHeight: "25px",
  marginLeft: "13px",
  marginTop: "9px",
  marginBottom: "0px",


};
const call = {
  height: "24px",	
    width: "333px",	
    color: "#BBBBBB",	
    fontFamily: "Rubik",	
    fontSize: "20px",	
    letterSpacing: "0.71px",
    marginTop: "29px",
    marginLeft: "352px",
    marginRight: "24px",
    lineHeight: "24px",
    whiteSpace: "nowrap",
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
    fontFamily: "Rubik",	
    fontSize: "16px",	
    letterSpacing: "0.57px",	
    lineHeight: "19px",	
    marginTop: "21px",
    marginBottom: "20px",
    textAlign: "center"};
const rightText = {
    marginLeft: "30px",
    display: "flex",
    textAlign: "center"};
const boxedText = {
      height: "45px",
      width: "310px",
      boxSizing: "border-box",
      border: "2px solid #3F691A",
      marginTop: "5px",
      marginBottom: "16px",
      
  };
  const insideTextL = {
    height: "19px",
    width: "183px",
    color: "#3F691A",
    fontFamily: "Rubik",
    fontSize: "16px",
    letterSpacing: "0.57px",
    lineHeight: "19px",
    paddingTop: "13px",
    paddingBottom: "13px",
    boxSizing: "border-box",
    marginLeft: "16px",
    display: "table-cell",
    borderRight: "2px solid #3F691A",

};
const insideTextR = {
  height: "19px",
  width: "86px",
  color: "#3F691A",
  fontFamily: "Rubik",
  fontSize: "16px",
  fontWeight: "500px",
  letterSpacing: "0.57px",
  lineHeight: "19px",
  borderSpacing: "13px",
  marginLeft: "16px",
  display: "table-cell",
};
const buttonStyle = {
  marginRight: "24px",
  marginLeft: "225px",
  marginTop: "5px",
  marginBottom: "20px",
  height: "45px",	
  width: "136px",
  fontFamily: "Rubik",
  fontSize: "16px",
  letterSpacing: "0.57px",
  lineHeight: "19px",
  background: "#F6F7F6",
  color: "#595959",
  fontWeight: "400",
};
const phone= {
  color: "#3F691A",
};



class entMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {}
this.setStyle = this.setStyle.bind(this);
}
    setStyle(){
        console.log(this.props.location)
      this.border_lumber_select = {
        borderBottom: this.props.location =='/upload' ? "2px solid #3F691A" : "",
        marginLeft: "32px",
      };
      this.border_profile_select = {
        borderBottom: this.props.location =='/customers' ? "2px solid #3F691A" : "",
        marginLeft: "32px",
      };
      this.border_order_select = {
        borderBottom: this.props.location =='/invoice' ? "2px solid #3F691A" : "",
        marginLeft: "32px",
      };
    }
  render() {
    this.setStyle()
        return (
      <div>
        <Grid fluid padded={false} columns={2} style={gridS}>
          <Grid.Row fluid stye={greenBut}>
          <Grid.Column>
          <Link to={"/"} style={navbar}>
        Lumber.io
        </Link>
        </Grid.Column>
        <Grid.Column >
              </Grid.Column>
      </Grid.Row>
      </Grid>
      <Menu size="none" style={{marginTop: '19px', paddingBottom: '0px',boxShadow: "none",
  border: "none",marginBottom: '0px',	height: "60px"}}>
      <Menu.Item style={tabs}>
      <div style={this.border_lumber_select}>
        <Link to={"/upload"}>
        <div style={tabText}>
            Data Entry
            </div>
            </Link>
            </div>
      </Menu.Item >
      <Menu.Item style={tabs}>
      <div style={this.border_order_select}>
      <Link to={"/invoice"}>
        <div style={tabText}>
            Customer Invoicing
            </div>
            </Link>
            </div>
      </Menu.Item >
      <Menu.Item style={tabs}>
      <div style={this.border_profile_select}>
      <Link to={"/customers"}>
        <div style={tabText}>
            TBD
            </div>
            </Link>
            </div>
      </Menu.Item >
      </Menu>
      </div>
    )

}
}

export default entMenu;
