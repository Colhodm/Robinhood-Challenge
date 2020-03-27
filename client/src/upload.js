import React, { Component,useReducer } from "react";
import axios from "axios";
import { Image,Grid,Card, Portal,Header, Form, Input, Icon, Button,Menu,Table,Segment,List,Container,Accordion } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route, Link  } from 'react-router-dom';
import Formx from "./Formx"
import FormData from 'form-data';
import AddData from './data_imputation';
import Data from './data_source';
import EntMenu from './entMenu';
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
class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data:[<Data updateParent={this.updateParent} identifier={0}/>],
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
    axios.post(endpoint + "api/project/uploadData", group,{
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
  uploadCSV = () => {
    console.log(this.state.csv)
    let form = new FormData();
    // Second argument  can take Buffer or Stream (lazily read during the request) too.
    // Third argument is filename if you want to simulate a file upload. Otherwise omit.
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    form.append('file', new Blob([this.state.csv], { type: 'text/csv' }));
    console.log(this.props)
    //form.append('id', this.props.match.params.id.substring(1));

    axios.post(endpoint + "api/project/upload", form, config
    ).then(result => {
      // Handle result…
      if (result.status == 200){
        this.setState({upload: false,uploadErr : false,open:true})
      } else {
        this.setState({uploadErr: true })
      }
    });
  };
  handleChange = (event) => {
    this.setState({
      csv: event.target.files[0],
      upload: true,
    },
    this.uploadCSV
    )
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
        <Header style={{marginLeft:"50px",marginTop:"50px"}}> Either upload a document or manually input data </Header>
        <div>
        <Input
        style={{marginLeft:"50px"}}
   type="file"
   ref={(input) => { this.filesInput = input }}
   name="file"
   icon='file text outline'
   iconPosition='left'
   label='Upload CSV'
   labelPosition='right'
   placeholder='UploadCSV...'
   onChange={this.handleChange}
   loading={this.upload}
   error={this.uploadErr}
 />        
        </div>
        <div  style={{marginLeft:"50px", marginTop:"50px"}}>
            <Card.Group>{this.state.data}</Card.Group>
            <AddData createData={this.createData}/>
            <Button onClick={this.uploadData} style={{marginTop:"50px"}} type='submit'>Submit</Button>
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
export default Upload;
