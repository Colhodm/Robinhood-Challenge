import React, { Component,useReducer } from "react";
import axios from "axios";
import { Image,Grid,Card, Portal,Divider,Header, Search,Form, Input, Icon, Button,Menu,Table,Segment,List,Container,Accordion } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route, Link  } from 'react-router-dom';
import Formx from "./Formx"
import FormData from 'form-data';
import AddData from './data_imputation';
import CustOrder from "./custOrder"
import Data from './data_source';
import EntMenu from './entMenu';
import NewCustomer from "./addCustomer";
let endpoint = "http://35.227.147.196:8080/";
function ExtraContentAccordionClosed({ onClick }) {
    return (
      <Card.Content extra>
        <Button basic circular icon size="tiny" onClick={onClick}>
          <Icon name="plus circle" />
        </Button>
        Expand
      </Card.Content>
    );
  }
  // Credit that some of this was inspired from a link online at the following url
  // https://codesandbox.io/embed/semantic-ui-card-extra-content-toggle-kybt2
  function ExtraContentAccordionOpened({ content, onClick }) {
    return (
      <>
        <Card.Content extra>{content}</Card.Content>
        <Card.Content extra>
          <Button basic circular icon size="tiny" onClick={onClick}>
            <Icon name="minus circle" />
          </Button>
          Collapse
        </Card.Content>
      </>
    );
  }
  function ExtraContentAccordion({ open, content, onClick}) {
    return open === true ? (
      <ExtraContentAccordionOpened content={content} onClick={onClick} />
    ) : (
      <ExtraContentAccordionClosed onClick={onClick} />
    );
  }
class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data:[<Data updateParent={this.updateParent} identifier={0}/>],
        orders:[<CustOrder/>,<CustOrder/>],
        expanded:[false,false],
        name:"Project Name",
        upload:false,
        open:false,
        raw_data:[],


    };
      this.join=this.join.bind(this);
      this.closeEmail=this.closeEmail.bind(this);
      this.createData=this.createData.bind(this);
      this.uploadData=this.uploadData.bind(this);
      this.updateParent = this.updateParent.bind(this);


  }
  closeEmail = () => {
    this.setState({ open: false })
  }
  updateParent = (value) => {
      // 1. Make a shallow copy of the items
      let temp_data = [...this.state.raw_data];
      // 2. Make a shallow copy of the item you want to mutate
      let item = {...temp_data[value.identifier]};
      // 3. Replace the property you're intested in
      Object.assign(item, value);
      delete item["data"]; 
      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      temp_data[value.identifier] = item;
      // 5. Set the state to our new copy
      this.setState({raw_data:temp_data},console.log(this.state.raw_data));
  }
  createData = () => {
        this.setState({
            data:this.state.data.concat([<Data updateParent={this.updateParent} identifier={this.state.data.length}/>])
        });
    };
  uploadData =() => {
    var group = this.state.raw_data
    console.log(group,Object.keys(group))
    axios.post(endpoint + "api/project/invoice", group,{
      headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
    ).then(result => {
      // Handle result…
      if (result.status == 200){
        this.setState({upload: false,uploadErr : false,open:true})
      } else {
        this.setState({uploadErr: true })
      }
    });
  }
  toggleCard0(card) {
    const temp_expand = this.state.expanded.slice()
    temp_expand[0] = !temp_expand[0]
    this.setState({expanded: temp_expand})
  }
  toggleCard1(card) {
    const temp_expand = this.state.expanded.slice()
    temp_expand[1] = !temp_expand[1]
    this.setState({expanded: temp_expand})
  }
  updateEmail = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ email: value.target.value });
  };
  join(){
      // this function makes a call to our backend with the current email in the box
      // TODO call the backend from here
  }
    sendData(data) {
        this.props.buttonClick(data);
    };
    //TODO the icon should acutally by a 48 by 48 right now it is 30 by 30
    //<Card.Group>{this.state.data}</Card.Group>
   // <AddData createData={this.createData}/>
    //
    render() {
    return (
        <div>
        <div class="info-top">
        <EntMenu location={this.props.location.pathname}/>
        </div>
        <Grid verticalAlign="middle" columns={2} style={{marginTop:"0px"}}>
          <Grid.Column>
        <Search      attached='right' defaultValue={"Company Name"} style={{marginTop:"40px",marginLeft:"60px"}}>
        </Search>
        </Grid.Column>
        <Grid.Column>
          <NewCustomer></NewCustomer>
        </Grid.Column>
        </Grid>
        <Card.Group itemsPerRow={2} fluid style={{marginLeft:"50px",marginTop:"20px"}}>
          <Card>
          <Card.Content>
            <Image
          floated='right'
          size='mini'
          src='/images/avatar/large/steve.jpg'
          />
          <Card.Header>Company Name</Card.Header>
          <Card.Meta>Company Meta Data</Card.Meta>
          <Card.Description>
          Describe this company with some words <strong>really strong words</strong>
        </Card.Description>
        <Card.Header style={{marginTop:"12px"}}>Lumber Preferences</Card.Header>
        <Divider></Divider>
        <List horizontal relaxed>
          
          <List.Item>
        <List.Header>Sawmill </List.Header>
        </List.Item>
        <List.Item>
        West Fraser
        </List.Item>
        <List.Item>
          Dunkley
          </List.Item>
          <List.Item>
          Sawmill
          </List.Item>
        </List>
          <Divider></Divider>
          <List horizontal relaxed>
          <List.Item>
        <List.Header>Grade </List.Header>
        </List.Item>
        <List.Item>
        Grade 1
        </List.Item>
        <List.Item>
          Grade 2
          </List.Item>
          <List.Item>
          Grade 3
          </List.Item>
        </List> 
        <Divider></Divider>
        <List horizontal relaxed>
          <List.Item>
        <List.Header>Size </List.Header>
        </List.Item>
        <List.Item>
        1x3
        </List.Item>
        <List.Item>
          2x4
          </List.Item>
          <List.Item>
          3x6
          </List.Item>
        </List> 
        <Divider></Divider>
        <List horizontal relaxed>
          <List.Item>
        <List.Header>Length </List.Header>
        </List.Item>
        <List.Item>
        8'
        </List.Item>
        <List.Item>
          16'
          </List.Item>
          <List.Item>
          24'
          </List.Item>
        </List> 
               
        <Card.Content extra>
          <a>
        <Icon name='user' />
        Ranked 22
      </a>
        </Card.Content>
      </Card.Content>
          </Card>

          <Card>
          <Card.Content>
          <Card.Header>Contact Information</Card.Header>
          <Card.Meta>Address of Business</Card.Meta>
          <Divider></Divider>
          <List relaxed>
          <List.Item>
        <List.Header>Person on Account </List.Header>
        </List.Item>
        <List.Item>
        <List.Header>CEO</List.Header>
        Donald Jones <strong>408-621-2416</strong>
        </List.Item>
        <List.Item>
        <List.Header>Account Executive</List.Header>
          Ron James  <strong>408-621-2416</strong>
          </List.Item>
          <List.Item>
          <List.Header>CFO </List.Header>
          Barney Smith  <strong>408-621-2416</strong>
          </List.Item>
        </List>
          </Card.Content>
          </Card>
          <Card>
            <Card.Content>
          <Card.Header>Most Recent Orders</Card.Header>
          </Card.Content>
          <Card.Group>{this.state.orders}</Card.Group>
          </Card>
          <Card>
            <Card.Content>
              <Card.Header>
                Create Invoice
              </Card.Header>
              <Form>
    <Form.Field>
      <label>Location</label>
      <input  name='location' value={this.state.location} placeholder='Edgewood' onChange={this.handleChange}/>
    </Form.Field>
    <Form.Field>
      <label>Grade</label>
      <input name='grade' value={this.state.grade} placeholder='Platinum' onChange={this.handleChange}/>
    </Form.Field>
    <Form.Field>
      <label>Size</label>
      <input name='size' value={this.state.size} placeholder='2x4' onChange={this.handleChange}/>
    </Form.Field>
    <Form.Field>
      <label>Length</label>
      <input name='size' value={this.state.size} placeholder='2x4' onChange={this.handleChange}/>
    </Form.Field>
    <Button onClick={this.addGroup}>Add another entry</Button>
  </Form>
            </Card.Content>

          </Card>
        </Card.Group>
        <div>   
        </div>
        <div  style={{marginLeft:"50px", marginTop:"50px"}}>
            </div>
            <Portal
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
                height: '326px',
                width: '403px',
                marginLeft: '519px',
                marginRight: '518px',
                position: 'relative',
                top: '196px',
                background: '#FFFFFF',
                zIndex: 1,
              }}
            >   
            <Icon  onClick={this.closeEmail}  style={{color:'#AAAAAA',marginLeft: '40px',marginRight: '346px',marginTop: '27px'}}
            size={'small'}name='close'/>    
               <Icon style={{color:'#AAAAAA',marginLeft: '167px',marginRight: '166px',marginTop: '22px'}}
            size={'huge'}name='mail outline'/>        
            <div className='email-head'>
            We uploaded your CSV!  
            </div>  
            <div className='email-text'>
              We will have some updates for you soon!
              </div>
              <Button  className="button-text"
                style={{width:"96px",height: "36px",marginLeft:"150px",marginRight:"157px",
                marginTop:"2px",marginBottom:"12px",paddingRight:"16px",paddingLeft:"16px"}}  
                 onClick={this.closeEmail} >
                  <div className='email-but'>
                    GOT IT
                    </div>
                </Button>
            </Card>      
            </div>
        </Portal>
  </div>
)
}
}
export default Invoice;
