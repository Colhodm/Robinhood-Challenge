import React, { Component } from "react";
import axios from "axios";
import { Image,Grid,Card, Header, Form, Input, Icon, Button } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route, Link  } from 'react-router-dom';

let endpoint = "http://35.227.147.196:8080/";
const gridoffset = {
          marginTop: "150px",
          textAlign:"center",
          fontFamily: "	OverpassSemiBold",
};
const mybigtext = {
          fontSize: "50px",
          fontWeight: "bold",

};
const mymidtext = {
    fontSize: "20px",
    fontWeight: "lighter"
};
const submit = {
    width : "50%",
    height: "180px",
    margin: "0 auto",
};

class CentralText extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email: "",
      };
      this.join=this.join.bind(this);

  }
  updateEmail = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ email: value.target.value });
  };
  join(){
      //console.log(14)
      let email = this.state.email
      axios
      .post(
        endpoint + "/api/joinnow",
        {
      email
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )
      .then(res => {
        //console.log(res);
      });
  }
    sendData(data) {
        this.props.buttonClick(data);
    };
    render() {
    return (
<Grid divided='vertically' style={gridoffset}>
    <Grid.Row columns={1}>
            <Grid.Row columns={1}>
                <Grid.Column>
                    <Header as='h1'style={mybigtext}>
                        Listen to music as if you were live.
                        </Header>
                        <Header as= 'h1' style={mymidtext}>
                        Jump in to your favorite artists anytime you want. 
                        </Header>
                    </Grid.Column>
            </Grid.Row>
  </Grid.Row>
  </Grid>
)

}
}
export default CentralText;
