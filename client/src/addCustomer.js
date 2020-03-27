import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { Container, Image, Menu,Button,Portal,Header,Card ,Form ,Input,Divider,Icon,Dropdown} from 'semantic-ui-react';
import validator from 'validator';

let endpoint = "https://lumberio.com";

// since menu has 10 margin
const form_formatting = { marginLeft: "36px", marginRight: "32px",marginTop: "25px" };
const pref_formatting = { marginLeft: "37px", marginRight: "20px",marginTop: "25px" };

const submit = {
  background: "#3F691A",
  height:"42px",
  width: "120px",
  boxShadow: "0 2px 3px 0 rgba(0,0,0,0.2)"
};
const greenBut = {
  background: "#759E33",
  color: "white",
};
class NewCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    activeItem: "register",
    name: "",
    Location: "",
    buyer: false,
    seller: false,
    // TEMPORARY FOR DEV LINK this with whatever page needs it?
    emailOpen: false,
    // TODO set these to the correct default values
    errCompany: false,
    errContact: false,
    // not answering these is acceptable
   // errLumber: false,
   // errLength: false,
    errLoc: false,
    errSubmit: false,

    sawmills:[["Dunkley",false],["West Fraser",false],["Mill 3",false],["Mill 4",false]],
    grades:[["Grade 1",false],["Grade 2",false],["Grade 3",false],["Grade 4",false]],
    //["Spruce",false],["Pine",false],["Fir",false],["Cedar",false],["Other",false]],
    sizes:[["2 x 4",false],["2 x 6",false],["2 x 8",false],["2 x 8",false],
    ["1 x 2",false],["1 x 3",false],["1 x 4",false],["Other",false]],
    lengths:[["8'",false],["16'",false],["32'",false],["48'",false],
    ["64'",false],["128'",false],["96'",false],["100'",false]],

  };
  this.loadCard = this.loadCard.bind(this)
  this.loadNext = this.loadNext.bind(this)
  this.validateForm = this.validateForm.bind(this)
  this.registerUser= this.registerUser.bind(this)
  this.setButton=this.setButton.bind(this);
  this.closeEmail=this.closeEmail.bind(this);
  this.switchRegister=this.switchRegister.bind(this);
  }
  registerUser = () => {
    let email = this.state.company
    let lumber = this.state.favorites
    let length = this.state.lengths

    axios
    .post(
      endpoint + "/api/register",
      {
    email,lumber,length
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    )
    .then(res => {
	    if (res.status === 200){
	    this.setState({ emailOpen:true});
	    //console.log(res);
	    }
    });
  };
  onEChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ companyName: value.target.value });
  };
  onLChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ Location: value.target.value });
  };
  onPChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ contact: value.target.value });
  };
  loadNext(){
    this.setState({ activeItem: "prefer" });
  }
  validateForm(){
      // this function makes a call to our backend with the current email in the box
      // TODO call the backend from here
      var validated = true
      if (!(validator.isEmail(this.state.company))) {
        validated = false
        this.setState({
          errEmail: true
      });
      } 
      if (this.state["Location"].length === 0){
        validated = false
        this.setState({
          errLoc: true
      });
      }
      if (validated){
        var response = this.registerUser()
        // if token not valid 
        // if response not valid throw an error on the page
        this.setState({ 
          open: false,
        })
      }
    }
    
  handleOpen = () => {
    this.setState({ open: true })
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleClose = () => {
    this.setState({ open: false })
  }
  closeEmail = () => {
    this.setState({ emailOpen: false })
  }  
  setButton = (e, data) => {
    // access to e.target here
    //console.log(data,data.index);
    if (data.type == "mill"){
    const fav = this.state.sawmills.slice()
    fav[data.index][1] = !fav[data.index][1]
    this.setState({sawmills: fav})
    } else if (data.type == "len"){
      const len = this.state.lengths.slice()
      len[data.index][1] = !len[data.index][1]
      this.setState({lengths: len})
    } else if (data.type == "grade"){
      const grade = this.state.grades.slice()
      grade[data.index][1] = !grade[data.index][1]
      this.setState({grades: grade})
    } else {
      const size = this.state.sizes.slice()
      size[data.index][1] = !size[data.index][1]
      this.setState({sizes: size})
    }
}
  loginUser(){
    this.setState({activeItem: "login"})
  
  }
  switchRegister(){
    this.setState({activeItem: "register"})
  }
  setMillStyle(){
    //TODO ensure first guys margin is effectively 24 
    const favorites = this.state.sawmills;
    var result = [];
    for (var i = 0; i < favorites.length; ++i) {
        var margin_left = i == 0|| i == 6? "2px":"16px"
        var margin_right = i == 5? "50px":"0px"
        //console.log(favorites[i][1])
        if (favorites[i][1]){
          result.push(<Button style={{marginLeft:margin_left,marginRight:margin_right,marginBottom:"16px",height:"36px",background:"#0F4210"}} index={i} type={"mill"} onClick={this.setButton} className="cho-reg-choices" icon='check circle outline' content={favorites[i][0]} />);
        } else {
          result.push(<Button style={{marginLeft:margin_left,marginRight:margin_right,marginBottom:"16px",height:"36px",background:"#FFFFFF"}} index={i} type={"mill"} onClick={this.setButton} className="reg-choices"  content={favorites[i][0]}  /> );
        }
    }
    return result
  }
  setGradeStyle(){
    //TODO ensure first guys margin is effectively 24 
    const favorites = this.state.grades;
    var result = [];
    for (var i = 0; i < favorites.length; ++i) {
        var margin_left = i == 0 ? "2px":"16px"
        if (favorites[i][1]){
          result.push(<Button style={{marginLeft:margin_left,marginBottom:"16px",height:"36px",background:"#0F4210"}} index={i} onClick={this.setButton} type={"grade"} className="cho-reg-choices" icon='check circle outline' content={favorites[i][0]} />);
        } else {
          result.push(<Button style={{marginLeft:margin_left,marginBottom:"16px",height:"36px",background:"#FFFFFF"}} index={i} onClick={this.setButton} type={"grade"}  className="reg-choices"  content={favorites[i][0]}  /> );
        }
    }
    return result
  }
  setSizeStyle(){
    //TODO ensure first guys margin is effectively 24 
    const favorites = this.state.sizes;
    var result = [];
    for (var i = 0; i < favorites.length; ++i) {
        var margin_left = i == 0 ? "2px":"16px"
        if (favorites[i][1]){
          result.push(<Button style={{marginLeft:margin_left,marginBottom:"16px",height:"36px",background:"#0F4210"}} index={i} onClick={this.setButton} type={"size"} className="cho-reg-choices" icon='check circle outline' content={favorites[i][0]} />);
        } else {
          result.push(<Button style={{marginLeft:margin_left,marginBottom:"16px",height:"36px",background:"#FFFFFF"}} index={i} onClick={this.setButton} type={"size"} className="reg-choices"  content={favorites[i][0]}  /> );
        }
    }
    return result
  }
  setLenStyle(){
    //TODO ensure first guys margin is effectively 24 
    const favorites = this.state.lengths;
    var result = [];
    for (var i = 0; i < favorites.length; ++i) {
        var margin_left = i == 0 ? "2px":"16px"
        if (favorites[i][1]){
          result.push(<Button style={{marginLeft:margin_left,marginBottom:"16px",height:"36px",background:"#0F4210"}} index={i} onClick={this.setButton} type={"len"} className="cho-reg-choices" icon='check circle outline' content={favorites[i][0]} />);
        } else {
          result.push(<Button style={{marginLeft:margin_left,marginBottom:"16px",height:"36px",background:"#FFFFFF"}} index={i} onClick={this.setButton} type={"len"}  className="reg-choices"  content={favorites[i][0]}  /> );
        }
    }
    return result
  }
  loadCard() {
      //      <div class="email-address"  style={{marginBottom:"6.5px"}}> Contact Information</div>
      if (this.state.activeItem === "register"){
      return  <Form style={form_formatting}>
      <Form.Field style={{marginTop:"0px"}}>
        <div class="email-address"  style={{marginBottom:"6.5px"}}>Company Name</div>
        <Form.Input  
        error={this.state.errEmail}
        value={this.state.company}
        onChange={this.onEChange}
        style={{color:"#595959",	fontFamily: "Rubik",
        fontSize: "13px",letterSpacing: ".46px",lineHeight: "17px",marginRight:"21px",width:"607px",marginBottom:"16px"}}/>
      </Form.Field>


      <Form.Group widths='equal'  style={{color:"#595959",	fontFamily: "Rubik",
        fontSize: "13px",letterSpacing: ".46px",lineHeight: "17px",width:"607px",marginBottom:"16px"}}>
      <Form.Field>
        <Form.Input label="Name"   
          error={this.state.errContact}
          value={this.state.contact}
          onChange={this.onPChange}/>
      </Form.Field>
      <Form.Field>
      <Form.Input  
          label="Position"
          error={this.state.errContact}
          value={this.state.contact}
          onChange={this.onPChange}
      />
      </Form.Field>
      <Form.Field>
      <Form.Input   
          label="Phone Number"
          error={this.state.errContact}
          value={this.state.contact}
          onChange={this.onPChange}
       />
      </Form.Field>
      </Form.Group>
      
      <Form.Field style={{width:"607px",marginTop:"20px"}}>
      <div class="email-address"  style={{marginBottom:"6.5px"}}> About</div>
      <Form.TextArea placeholder='Describe the company...' />
      </Form.Field>
      <Form.Field style={{marginTop:"16px"}}>
        <div class="email-address"  style={{marginBottom:"6.5px"}}>Location</div>
        <Form.Input 
             error={this.state.errLoc}
             value={this.state.Location}
             onChange={this.onLChange}
         style={{color:"#595959",	fontFamily: "Rubik",
        fontSize: "13px",letterSpacing: ".46px",lineHeight: "17px",marginRight:"21px",width:"607px",marginBottom:"23.5px"}}/>
      </Form.Field>
      <Form.Group>
      <Form.Button color="blue" size="large" style={submit} onClick={this.loadNext} >
<div className="button-text">NEXT</div>
</Form.Button>
    <Form.Button size="large" 
      style={{background:"#FFFFFF",height:"42px",width: "120px",marginLeft:"375px",	
      boxShadow: "0 2px 3px 0 rgba(0,0,0,0.2)"}}
      onClick={this.handleClose}>
<div className="button-text" style={{color:"#3F691A"}}>CANCEL</div></Form.Button>
</Form.Group>
</Form>
      }
      let return_grade = this.setGradeStyle()
      let return_mill = this.setMillStyle()
      let return_size = this.setSizeStyle()
      let return_len = this.setLenStyle()
      return <Form style={pref_formatting}>
                <Form.Field style={{marginTop:"8px",marginLeft:"3px"}}>
                <div class="email-address"  style={{marginBottom:"6.5px"}}>Preferred Sawmills:</div>
                <Dropdown
                placeholder='Select a sawmill of choice'
                fluid
                search
                selection
                options={return_mill}
  />                </Form.Field>
                <Form.Field style={{marginTop:"8px"}}>
                <div class="email-address"  style={{marginBottom:"6.5px"}}>Preferred Grade:</div>
                {return_grade}
                </Form.Field>
                <Form.Field style={{marginTop:"8px"}}>
                <div class="email-address"  style={{marginBottom:"6.5px"}}>Preferred Size:</div>
                <Dropdown
                placeholder='Select a size of choice'
                fluid
                search
                selection
                options={return_size}/>         
                </Form.Field>
                <Form.Field style={{marginTop:"8px"}}>
                <div class="email-address"  style={{marginBottom:"6.5px"}}>Preferred Length:</div>
                <Dropdown
                placeholder='Select a length of choice'
                fluid
                search
                selection
                options={return_len}/>         
                </Form.Field>
                <Form.Group style={{marginTop:"60px"}}>
                <Form.Button  className="button-text"
                style={{width:"180px",height: "42px",marginLeft:"0px",marginTop:"2px",marginBottom:"16px",background:"#3F691A"}}   onClick={this.validateForm}  
                >
                <div style={{color:"#FFFFFF"}}>
                ADD CUSTOMER
                </div>
                </Form.Button>
                <Form.Button size="large" 
      style={{background:"#FFFFFF",height:"42px",width: "120px",marginLeft:"315px",	
      boxShadow: "0 2px 3px 0 rgba(0,0,0,0.2)"}}
      onClick={this.handleClose}>
<div className="button-text" style={{color:"#3F691A"}}>CANCEL</div></Form.Button>
</Form.Group>
      </Form>
  }

  loadMenu(){
    if (this.state.activeItem === "login"){
      return <Menu className='menu-text' fluid widths={1} size={"massive"} style={{height: "60px",marginBottom: "0px"}}>
      <Menu.Item className='menu-text' name='register' > Login </Menu.Item>
    </Menu>
    }
    return <Menu className='menu-text' fluid widths={2} size={"massive"} style={{height: "60px",marginBottom: "0px"}}>
    <Menu.Item className='menu-text' name='register' onClick={this.handleItemClick} active={this.state.activeItem == 'register'} >Register (1 of 2 steps)</Menu.Item>
    <Menu.Item className='menu-text' name='prefer' onClick={this.handleItemClick} active={this.state.activeItem == 'prefer'} >Preference (2 of 2 steps)</Menu.Item>
  </Menu>
  }
  render() {
    // FOR NOW FOR TESTING
    let displaycard = this.loadCard()
    let myMenu = this.loadMenu()
//              <Button content='Login/Sign In' style={greenBut} />

    return (
      <div>            
            <Portal
            closeOnTriggerClick
            openOnTriggerClick
            trigger={
                <Button size="medium" floated={"right"} style={{marginLeft:"60px",marginTop:"45px"}}>Create New Customer</Button>
            }
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            open={this.state.open}
          >
            <div
            style={{
                height: '100%',
                width: '6366px',
                left: '0px',
                position: 'fixed',
                top: '0px',
                background: 'rgba(0,0,0,0.5)',
                zIndex: 1,
                overflowX:'hidden',
              }}>
            <Card
              style={{
                height: '509px',
                width: '707px',
                marginLeft: '399px',
                marginRight: '362.5px',
                position: 'relative',
                top: '100px',
                background: '#F6F7F6',
                zIndex: 1,
              }}
            >     
              {myMenu}
             {displaycard}
             <Divider style={{marginTop:"0px",marginBottom:"5px"}}/>
            </Card>
            </div>
          </Portal>
      <Portal
      open={this.state.companyOpen}
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
            <Icon style={{color:'#AAAAAA',marginLeft: '40px',marginRight: '346px',marginTop: '27px'}}
            size={'small'}name='close'/>    
               <Icon onClick={this.closeEmail} style={{color:'#AAAAAA',marginLeft: '167px',marginRight: '166px',marginTop: '22px'}}
            size={'huge'}name='mail outline'/>        
            <div className='email-head'>
            We sent you an email!  
            </div>  
            <div className='email-text'>
            You succesfully registered and can now login to Lumber.io!  
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

export default NewCustomer;
