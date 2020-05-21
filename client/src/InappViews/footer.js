import React, { Component } from "react";
import axios from "axios";
import { Card, Header,Button, Form, Input, Icon,List,Segment,Container,Grid } from "semantic-ui-react";
import { withRouter, BrowserRouter as Router, Switch, Route, Link  } from 'react-router-dom';

let endpoint = "http://localhost:8080/test";
const footer = {
  color: "#FFFFFF",
  fontFamily: "Rubik",
  fontSize: "16px",
  letterSpacing: "0.57px",
  lineHeight: "30px",
};
var style = {
  backgroundColor: "#F8F8F8",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  padding: "20px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "0px",
  width: "100%",
}

var phantom = {
display: 'block',
padding: '20px',
height: '0px',
width: '100%',
}
class Footer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    
    return (
      <div>
      <div style={phantom} />
      <Segment vertical style={{ width: '100%',marginTop: '0px',marginBottom: '0px',height: '244px',background: '#f47373' }}>
        <Container>
          <Grid divided inverted stackable>
            <Grid.Row>
              <Grid.Column width={3}>
                <div  class='lumber-io' >
                Tour
                    </div>
                <List link inverted>
                  <List.Item as='a' style={footer}> About </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
              <div  class='info' >
                  INFO
              </div>
                <List link inverted>
                  <List.Item as='a' style={footer}> Terms of Use</List.Item>
                  <List.Item as='a' style={footer}>Privacy Policy</List.Item>
                  <List.Item as='a' style={footer}>Knowledge Base</List.Item>
                  <List.Item as='a' style={footer}>Help Desk</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
              <div  class='info' >
                  SUPPORT
              </div>
              <List link inverted>
                <List.Item as='a' style={footer}> Help Desk </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={6}>
                  <Icon inverted size={"big"} style={{ width: '31px',height: '37px' }} name='facebook'/> 
                  <Icon  inverted size={"big"} style={{ width: '31px',height: '37px' }} name='instagram'/> 
                  <Icon  inverted size={"big"} style={{ width: '31px',height: '37px' }} name='twitter'/> 
                  <Icon inverted size={"big"} style={{ width: '31px',height: '37px' }} name='youtube'/> 
  
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        <div style={{ textAlign: 'center',color: "#BBBBBB", fontFamily: "Rubik",
        fontSize: "16px",letterSpacing: "0.57px",lineHeight: "19px",marginTop: '30px'}}>
          <Icon name='copyright outline'/>
        Copyright 2019. All rights reserved
        </div>
      </Segment>
  </div>
    )

}
}
export default Footer;
