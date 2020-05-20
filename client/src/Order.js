import React, { Component } from "react";
import axios from "axios";
import { Image,Grid,Card, Header, Form, Input, Icon, Button,Table,Segment,List,Container } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route, Link ,Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import Order from "./order_prim"
let endpoint = "http://35.227.147.196:8080/";
const gridoffset = {
          marginTop: "19.5px",
          textAlign:"center",
          fontFamily: "	OverpassSemiBold",
          background: "#F6F7F6",
          paddingBottom: "40px",
          width: "1366px",
};

const tableStyle = {
    width : "601px",
    height: "57px",
    marginLeft: "42.5px",
    marginRight: "722.5",
};
const rightTable = {
    color: "#595959",
    fontFamily: "Rubik",
    fontSize: "16px",
    letterSpacing: "0.57px",
    lineHeight: "19px",
    textAlign: "center",

};
class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
        //cars:[<Car identifier={0} stateLink={this.updateState.bind(this)} />],
        orders:[<Order/>],
        view: "active",
        auth: true,
    };
      this.join=this.join.bind(this);
      this.loadCard = this.loadCard.bind(this)
      this.updateView = this.updateView.bind(this)
      this.cancelView = this.cancelView.bind(this)
      this.activeView = this.activeView.bind(this)
      this.setStyle = this.setStyle.bind(this);

  }
  componentDidMount() {
    this.getOrdersInProg();
  }
  setStyle(){
    this.border_all_select = {
      borderBottom: this.state.view =='all' ? "2px solid #3F691A" : "",
      marginLeft: "32px",
    };
    this.border_open_select = {
      borderBottom: this.state.view =='active' ? "2px solid #3F691A" : "",
      marginLeft: "32px",
    };
    this.border_cancel_select = {
      borderBottom: this.state.view =='cancel' ? "2px solid #3F691A" : "",
      marginLeft: "32px",
    };
  }
  getOrdersInProg = () => {
    let value = Cookies.get('session_token')
    if (!value){
      this.setState({
        auth: false,
      });
      return
    }
    //console.log(value)
    //console.log("called the function")
    axios.get(endpoint + "auth/api/orders",{
        withCredentials: true,
    }).then(res => {
    //console.log(res);
    if (res.status == 401){
      this.setState({
        auth: false,
      });
      return
    }
    if (res.data) {
      this.setState({
        orders: res.data.map(driver => {
            if (driver.status === "transit"){
          return (
              <Order type={driver.type} seller={driver.seller} 
              buyer={driver.buyer} 
              location={driver.location}
              total={driver.total} date={driver.date} 
              status={driver.status} 
              />
          );
            }
        }),
        cancelOrd: res.data.map(driver => {
            if (driver.status === "cancel"){
          return (
              <Order type={driver.type} seller={driver.seller} 
              buyer={driver.buyer} 
              location={driver.location}
              total={driver.total} date={driver.date} 
              status={driver.status} 
              />
          );
            }
        })
      });
    } else {
      this.setState({
        orders: [<Order/>],
        cancelOrd: [<Order/>]
      });
    }
  });
};
  updateEmail = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ email: value.target.value });
    //console.log(value.target.value)
  };
  updateView() {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ view: "all" });
  };
  cancelView() {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ view: "cancel" });
  };
  activeView() {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ view: "active" });
  };
  join(){
      // this function makes a call to our backend with the current email in the box
      // TODO call the backend from here
      //console.log(this.state["email"])
  }
    sendData(data) {
        this.props.buttonClick(data);
    };
    loadCard(){
        // Todo figure out how the all look view should be like
        if (this.state.view === 'active'){
            return  <Card.Group>{this.state.orders}</Card.Group>
        } else if(this.state.view === 'cancel'){
            return <Card.Group>{this.state.cancelOrd}</Card.Group>
        } else {
            return <Card.Group>{this.state.orders}</Card.Group>
        }
    }
    render() {
        let displaycard = this.loadCard()
        this.setStyle()
        if (!this.state.auth){
          return <Redirect to='/login'  />
        }
    return (
<Grid fluid divided='vertically' style={gridoffset}>
    <Grid.Row columns={1}>
            <Grid.Row columns={1} stretched>
                <Grid.Column>
                    <Table celled columns style={tableStyle}>
                        <Table.Body>
                            <Table.Row >
                            <Table.Cell style={this.border_all_select} onClick={this.updateView}>
                                <div style={rightTable}>
                                All Orders
                                    </div>
                            </Table.Cell>
                            <Table.Cell style={this.border_open_select}onClick={this.activeView}>
                            <div style={rightTable}>
                                Open Orders
                                </div>
                            </Table.Cell>
                            <Table.Cell   style={this.border_cancel_select}onClick={this.cancelView}>
                            <div style={rightTable}>
                                Cancelled Orders
                                </div>
                            </Table.Cell>
                            </Table.Row>
                </Table.Body>
  </Table>
                    {displaycard}
                    </Grid.Column>
            </Grid.Row>
  </Grid.Row>
  </Grid>
)

}
}
export default Orders;
