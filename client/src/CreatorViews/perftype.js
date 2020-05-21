import React, { Component } from "react";
import axios from "axios";
import Moment from 'react-moment';

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
import { Link} from 'react-router-dom';
const  header = {
  fontWeight: "500",
  fontSize: "20px",
  fontFamily: "Rubik",
  color: "#595959",
  height: "24px",	
  width: "95px",
  letterSpacing: "0.71px",
  lineHeight: "24px",
  textDecoration: "underline",
  marginTop: "20px",
  marginLeft: "17px",
  marginRight: "255px",




};
const  headline = {
  marginLeft: "13px",
  marginRight: "36px",
  marginTop: "6px",
  marginBottom: "0px",
  height: "85px",	
  width: "318px",
  color: "#3F691A",
  fontFamily: "Rubik",
  fontSize: "42px",
  fontWeight: "300",
  letterSpacing: "1.5px",
  lineHeight: "42px",
    textAlign: "left",

};
const description_formatting = {
  marginLeft: "13px",
  marginRight: "15px",
  marginTop: "2px",
  textAlign: "left",

  // Get this padding bottom precisely
  paddingBottom: "30px",
  height: "88px",	
  width: "339px",
};
class Type extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.sendData=this.sendData.bind(this);

  }

  sendData(value){
    this.props.sendBundle(this.props)
  }
  handleChange = (e, { value }) => {
    this.setState({ carYear: value });
    this.props.stateLink(this.props.identifier, this.state);
  };
  // Later fix encode the id in the url variable parameter so it looks nicer
  // The link from the View more info should be a variable link later...
  render() {
    return (
      <Card style={{marginLeft:"43px",width:"367px",height:"600px"}}>
          <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
        <Header as="h3" textAlign={'center'} style={header}> {this.props.name} </Header>
        <Moment local>{this.props.date}</Moment>

        <div class="lumber-text" style={{lineHeight: "17px",marginLeft:"13px",marginTop:"10px",marginRight:"36px",width:"318px",height:"49px",textAlign:"left"}}>
          Selling for 
          <div style={{color:"#GGFFF",fontFamily:"Rubik",fontSize:"21px",fontWeight:"500",letterSpacing:".43px",lineHeight:"24px"}}>$ FREE 
          <Popup className="pop-up" content='You save by using Tour'
                       trigger={<Icon color={'grey'} name="question circle outline" />} />
          </div>
          </div>
       
          <Divider section style={{marginTop:"0px",marginBottom:"0px"}}/>
          <Link to={`/analytics` + this.props.id}>
          <Button style={{paddingLeft:"16px",paddingTop:"13px",paddingBottom:"13px",paddingRight:"16px",marginLeft:"24px",marginTop:"15px",marginRight:"24px",marginBottom:"16px",width:"319px",height:"42px",background:"#f47373",color:"#FFFFFF"}}> ANALYZE </Button>
          </Link>



    </Card>
    );
  }
}
export default Type;
