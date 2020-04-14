import React, { Component,useReducer } from "react";
import axios from "axios";
import { Image,Grid,Card, Portal,Divider,Header, Search,Form, Input, Icon, Button,Menu,Table,Segment,List,Container,Accordion } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route, Link  } from 'react-router-dom';
import CustOrder from "./custOrder"
import Data from './data_source';
import EntMenu from './entMenu';
import NewCustomer from "./addCustomer";
import SearchCustom from "./searchCustom"
let endpoint = "http://35.227.147.196:8080/";
class Email extends Component {
  constructor(props) {
    super(props);
    this.state = {
        emails:{"Salesforce":"Email0"},
        currentCompany:"",
        next:"",
        prev:"",
        id:0,
    };
    this.updateParent = this.updateParent.bind(this);
    this.updateCustomers = this.updateCustomers.bind(this);

}
  componentDidMount(){
    this.fetchEmails()
  }
  processData(){
    return this.state.customers
  }
  updateParent(value,customers){
      this.setState({currentCompany:value.companyname, customers:customers,id:value.id});
  }
  updateCustomers(tempCustomers){
    console.log(tempCustomers)
    this.setState({customers:tempCustomers,currentCompany:tempCustomers[0]["title"]});
}
queueEmail = (e,data) => { 
 // 1. Make a shallow copy of the items
 let temp_data = [...this.state.customers];
 // 2. Make a shallow copy of the item you want to mutate
 let item = {...temp_data[this.state.id]};
 // 3. Replace the property you're intested in
 item["queued"] = true
 temp_data[this.state.id] = item 
  this.setState({customers:temp_data});
}
  moveEmail = (e,data) => { 
    console.log(data.type)
    if (data.type === "next"){
    var next = this.state.customers[(this.state.id +1) % this.state.customers.length]["title"]
    this.setState({currentCompany:next,id:(this.state.id +1) % this.state.customers.length})
    }
    else {
      var prev = (this.state.id - 1) % this.state.customers.length
      if (prev === -1){
        prev = this.state.customers.length-1
      }
      this.setState({currentCompany:this.state.customers[prev]["title"],id:prev})
    }
  }
  fetchEmails = () => {
    axios
    .get(
      endpoint + "api/getEmails",
    )
    .then(res => {
      if (res.status === 200){
        console.log(res.data)
        this.setState({emails: res.data})
      }
    });
  }

    render() {
      console.log(this.state)
    return (
        <div>
        <div class="info-top">
        <EntMenu location={this.props.location.pathname}/>
        </div>
        <Grid verticalAlign="middle" columns={2} style={{marginTop:"0px"}}>
          <Grid.Column>
          <SearchCustom updateParent={this.updateParent} updateCustomer={this.updateCustomers} attached='right'  style={{marginTop:"40px",marginLeft:"60px",}}/>
        </Grid.Column>
        <Grid.Column>
        <Button size="medium" floated={"right"} style={{marginLeft:"60px",marginTop:"45px"}}>Send out all "queued" emails</Button>
        </Grid.Column>
        </Grid>
        <Card.Group itemsPerRow={1} fluid style={{marginLeft:"50px",marginTop:"20px"}}>
          <Card>
            <Card.Content>
              <Card.Header>
                Compose Email
              </Card.Header>
              <Card.Meta>
                {this.state.currentCompany}
              </Card.Meta>
              <Form>
              <Form.TextArea 
              name="email"     
              value={this.state.emails[this.state.currentCompany]} 
              onChange={this.handleChange} 
              placeholder='Email that will be sent out' />
      </Form>
            </Card.Content>
          </Card>
        </Card.Group>
        <Button.Group style={{marginLeft:"60px",marginTop:"40px"}}>
        <Button onClick={this.queueEmail}> Queue this email</Button>
        <Button.Group style={{marginLeft:"1000px"}} >
        <Button type={"previous"}  onClick={this.moveEmail}>Previous Email</Button>
        <Button type={"next"} onClick={this.moveEmail}>Next Email</Button>
        </Button.Group>
        </Button.Group>
        <div>   
        </div>
        <div  style={{marginLeft:"50px", marginTop:"50px"}}>
            </div>
  </div>
)
}
}
export default Email;
