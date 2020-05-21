import React, { Component } from "react";
import axios from "axios";
import { Image,Grid,Card, Header, Form, Input, Icon, Button,Table,Segment,List,Container } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route, Link,Redirect  } from 'react-router-dom';
import Type from "./lumtype"
let endpoint = "https://lumberio.com/";
const gridoffset = {
          marginTop: "19.5px",
          textAlign:"center",
          fontFamily: "	OverpassSemiBold",
          background: "#F6F7F6",
          paddingBottom: "40px",
          width: "1366px",

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
const greenBut = {
    background: "#759E33",
    color: "white",
  };
const tableStyle = {
    width : "481px",
    height: "57px",
    marginLeft: "34.5px",
    marginRight: "842.5",
};
const leftTable = {
    width : "135px",
    height: "19px",
    color: "#595959",
    fontFamily: "Rubik",
    fontSize: "16px",
    letterSpacing: "0.57px",
    lineHeight: "19px",
    marginLeft: "10px",

};
const rightTable = {
    width : "201px",
    height: "31px",
    color: "#BBBBBB",
    fontFamily: "Rubik",
    fontSize: "12px",
    letterSpacing: "0.57px",
    lineHeight: "14px",
    textAlign: "center",
    marginLeft: "19px",
    marginRight: "19.5",
    marginTop: "13.5",
    marginRight: "12.5",
};
class BestDeals extends Component {
  constructor(props) {
    super(props);
    this.state = {
        //cars:[<Car identifier={0} stateLink={this.updateState.bind(this)} />],
        types:[],

    };
      this.join=this.join.bind(this);

  }
  componentDidMount() {
    this.getBundles();
  }
  getBundles = () => {
    //console.log("called the function")
    axios.get(endpoint + "auth/api/lumberbundles",{
        withCredentials: true,
    }).then(res => {
    //console.log(res);
    if (res.data) {
      this.setState({
        types: res.data.map(driver => {
          return (
              <Type id={driver._id} type={driver.type} owner={driver.woodName} location={driver.location}
              price={driver.price} traits={driver.traits} sendBundle={this.props.sendBundle} date={driver.date}
              itemcost={driver.itemcost} shipcost={driver.shipcost} pretax={driver.pretax} 
              gst={driver.gst} pst={driver.pst} saving={driver.saving}
              />
          );
        })
      });
    } else {
      this.setState({
        types: [<Type/>]
      });
    }
  });
};
  updateEmail = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ email: value.target.value });
    //console.log(value.target.value)
  };
  join(){
      // this function makes a call to our backend with the current email in the box
      // TODO call the backend from here
      //console.log(this.state["email"])
  }
    sendData(data) {
        this.props.buttonClick(data);
    };
    render() {
    return (
<div>
<Grid divided='vertically' style={gridoffset}>
    <Grid.Row columns={1}>
            <Grid.Row columns={1}>
                <Grid.Column>
                    <Table celled columns style={tableStyle}>
                        <Table.Body>
                            <Table.Row>
                            <Table.Cell className='bundle-purchase'>
                                <div style={leftTable}>
                                Bundle Purchase
                                    </div>
                            </Table.Cell>
                            <Table.Cell>
                            <Link to='/info-individual'>
                            <div style={rightTable}>
                                 Individual Purchase (coming soon, click to learn more) 
                                </div>
                                </Link>
                            </Table.Cell>
                            </Table.Row>
                </Table.Body>
  </Table>
                    <Card.Group>{this.state.types}</Card.Group>
                    </Grid.Column>
            </Grid.Row>
  </Grid.Row>
  </Grid>
    </div>
)

}
}
export default BestDeals;