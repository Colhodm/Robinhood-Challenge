import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import axios from "axios";
import { Image,Grid,Card, Header, Form, Input, Icon, Button,Table,Segment,List,Container,Portal,Menu,Divider } from "semantic-ui-react";
import PerfPrimitive from "./perftype"
let endpoint = "http://35.227.147.196:8080/";
const form_formatting = { marginLeft: "36px", marginRight: "32px",marginTop: "25px" };
const gridoffset = {
          marginTop: "19.5px",
          textAlign:"center",
          fontFamily: "	OverpassSemiBold",
          background: "#F6F7F6",
          paddingBottom: "40px",
          width: "1366px",
};
const buttonoffset = {
marginTop: "19.5px",
marginLeft: "550px",
textAlign:"center",
fontFamily: "	OverpassSemiBold",
width: "200px",

};
class Performance extends Component {
  constructor(props) {
    super(props);
    this.state = {
        types:[],
        startDate: new Date(),


    };
      this.join=this.join.bind(this);
      this.validateForm = this.validateForm.bind(this)

      
  }
  registerUser = () => {
    let zoom = this.state.zoom
    let performance = this.state.performance
    let date = this.state.startDate
    axios
    .post(
      endpoint + "auth/api/register/performance",
      {
    zoom,performance,date
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    )
    .then(res => {
      // if fails indicate to user that the performance upload failed 
      console.log(res.data)
      this.setState({
        types: this.state.types.concat(<PerfPrimitive date={this.state.startDate} name={this.state.performance} url={this.state.zoom}/>)
      })
    });
  };
  onZChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ zoom: value.target.value });
  };
  onPChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ performance: value.target.value });
  };
  onTChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ time: value.target.value });
  };
  addClient(){
    // we doubly display the card on the page and ping our backend with the update
    
    this.registerUser()
  }
  validateForm(){
    // this function makes a call to our backend with the current email in the box
    // TODO call the backend from here
    var validated = true
    if (this.state.performance === 0){
      validated = false
      this.setState({
        errPerformance: true
    });
    }
    if (this.state.zoom === 0){
      validated = false
      this.setState({
        errZoom: true
    });
    }
    if (this.state.date === 0){
      validated = false
      this.setState({
        errDate: true
    });
    }
    if (this.state.time === 0){
      validated = false
      this.setState({
        errTime: true
    });
    }
    if (validated){
      var response = this.addClient()
      this.setState({ 
        open: false,
      })
    }
  }
  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  componentDidMount() {
    this.getPerformances();
  }
  getPerformances = () => {
    //console.log("called the function")
    axios.get(endpoint + "auth/api/performances",{
        withCredentials: true,
    }).then(res => {
    console.log(res);
    if (res.data) {
      this.setState({
        types: res.data.map(performance => {
          return (
              <PerfPrimitive date={performance.date} name={performance.name} url={performance.zoomurl} id={performance._id}
              />
          );
        })
      });
    } else {
      this.setState({
        types: []
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
                            <Card.Group>{this.state.types}
                            </Card.Group>
                            </Grid.Column>
                    </Grid.Row>
                    <Portal
                    closeOnTriggerClick
                    openOnTriggerClick
                    trigger={
                      <Button  onClick={this.add} style={buttonoffset} > Schedule a Performance</Button>
                    }
                    onOpen={this.handleOpen}
                    onClose={this.handleClose}
                    open={this.state.open}
                  >
                    <div
                    style={{
                        height: '100%',
                        width: '1366px',
                        left: '0px',
                        position: 'fixed',
                        top: '0px',
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 1,
                        overflowX:'hidden',
                      }}>
                    <Card
                      style={{
                        height: '410px',
                        width: '707px',
                        marginLeft: '399px',
                        marginRight: '362.5px',
                        position: 'relative',
                        top: '100px',
                        background: '#F6F7F6',
                        zIndex: 1,
                      }}
                    >     
                      <Menu className='menu-text' fluid widths={1} size={"massive"} style={{height: "60px",marginBottom: "0px"}}>
                        <Menu.Item className='menu-text' >Create Performance</Menu.Item>
                      </Menu>
                      <Form style={form_formatting}>
              <Form.Field style={{marginTop:"0px"}}>
                <div class="email-address"  style={{marginBottom:"6.5px"}}>Zoom Invitation:</div>
                <Form.Input  
                error={this.state.errZoom}
                value={this.state.zoom}
                onChange={this.onZChange}
                style={{color:"#595959",	fontFamily: "Rubik",
                fontSize: "13px",letterSpacing: ".46px",lineHeight: "17px",marginRight:"21px",width:"607px",marginBottom:"0px"}}/>
              </Form.Field>
              <Form.Field style={{marginTop:"16px"}}>
                <div class="email-address"  style={{marginBottom:"6.5px"}}>Performance name</div>
                <Form.Input 
                     error={this.state.errPerformance}
                     value={this.state.performance}
                     onChange={this.onPChange}
                 style={{color:"#595959",	fontFamily: "Rubik",
                fontSize: "13px",letterSpacing: ".46px",lineHeight: "17px",marginRight:"21px",width:"607px",marginBottom:"0px"}}/>
              </Form.Field>
              <Form.Field                      error={this.state.errDate}>
              <div class="email-address"  style={{marginBottom:"2.5px"}}>Date of Performance</div>
                <DatePicker         showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={20}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa" style={{marginRight:"3.5px"}}  selected={this.state.startDate}
                onChange={this.handleChange}></DatePicker>
              </Form.Field>
            </Form >
                     <Divider style={{marginTop:"0px",marginBottom:"5px"}}/>
            <div style={{display:"flex",height:"55px"}}>
              <Button size="large" style={{background:"#FFFFFF",
              height:"42px",width: "120px",marginBottom:"13px",
              marginLeft:"17px",
              boxShadow: "0 2px 3px 0 rgba(0,0,0,0.2)"}} onClick={this.validateForm} >
                Done
              </Button>
        
              <Button size="large" 
              style={{background:"#FFFFFF",float:"right",height:"42px",width: "120px",marginBottom:"13px",
              marginLeft:"450px",
              boxShadow: "0 2px 3px 0 rgba(0,0,0,0.2)"}}
              onClick={this.handleClose} >
        <div className="button-text" style={{color:"blue"}}>CANCEL</div></Button>
              </div>
                    </Card>
                    </div>
                  </Portal>
          </Grid.Row>
          </Grid>
            </div>
)

}
}
export default Performance;
