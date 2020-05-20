import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { Container, Image, Menu,Button,Portal,Header,Card ,Form ,Input,Divider,Icon} from 'semantic-ui-react';
import PasswordStrengthBar from 'react-password-strength-bar';
import validator from 'validator';

let endpoint = "https://lumberio.com";

const mynav = {
    background: "inherit",
    height: "75%",
    color: "#f47373"3,
    fontFamily: "Overpass",	
    fontSize: "16px",	
    fontWeight: 600,
    lineHeight: "25px",
    boxShadow: "none",
    border: "none"
};
// since menu has 10 margin
const form_formatting = { marginLeft: "36px", marginRight: "32px",marginTop: "25px" };
const pref_formatting = { marginLeft: "37px", marginRight: "20px",marginTop: "45px" };

const submit = {
  marginRight: "519px",
  marginBottom: "42px",
  background: "#f47373"};
const navbar = {
  color: "#f47373",
  fontFamily: "Overpass",	
  fontSize: "16px",	
  fontWeight: 600,
  lineHeight: "25px",
  marginLeft: "100px",
};
const greenBut = {
  background: "#f47373",
  color: "white",
};
const lip = {
  color: "#f47373",
};
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    activeItem: "register",
    email: "",
    name: "",
    password: "",
    Location: "",
    buyer: false,
    seller: false,
    // TEMPORARY FOR DEV LINK this with whatever page needs it?
    emailOpen: false,
    // TODO set these to the correct default values
    errEmail: false,
    errName: false,
    errPassword: false,
    // not answering these is acceptable
   // errLumber: false,
   // errLength: false,
    errLoc: false,
    errSubmit: false,
    errSeller: false,
    errBuyer: false,

    favorites:[["SPF",false],["Douglas Green",false],["Southern Pine",false],["Other",false]],
    //["Spruce",false],["Pine",false],["Fir",false],["Cedar",false],["Other",false]],
    lengths:[["2 x 4",false],["2 x 6",false],["2 x 8",false],["2 x 8",false],
    ["1 x 2",false],["1 x 3",false],["1 x 4",false],["Other",false]],

  };
  this.loadCard = this.loadCard.bind(this)
  this.loadNext = this.loadNext.bind(this)
  this.validateForm = this.validateForm.bind(this)
  this.registerUser= this.registerUser.bind(this)
  this.setLumStyle = this.setLumStyle.bind(this);
  this.setLenStyle = this.setLenStyle.bind(this);
  this.setButton=this.setButton.bind(this);
  this.closeEmail=this.closeEmail.bind(this);
  this.loginUser=this.loginUser.bind(this);
  this.switchRegister=this.switchRegister.bind(this);
  this.validateLoginForm = this.validateLoginForm.bind(this)
  this.loginBackendUser= this.loginBackendUser.bind(this)
  }
  registerUser = () => {
    let email = this.state.email
    let name = this.state.name
    let password = this.state.password
    let buyer = this.state.buyer
    let lumber = this.state.favorites
    let length = this.state.lengths

    axios
    .post(
      endpoint + "/api/register",
      {
    email,password,buyer,lumber,length
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
    this.setState({ email: value.target.value });
  };
  onLChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ Location: value.target.value });
  };
  onPChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ password: value.target.value });
  };
  onStrengthChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    if (value){
    //console.log(value)
    this.setState({ passwordStrength: value });
    }
  };
  onTypeChange = (e, data) => {
    // TODO if its an invalid email we can prompt them for an error later
    // Can someone be both a buyer and seller?
    if (data.name == "buyer"){
      this.setState({ buyer: data.checked });
    } else {
      this.setState({ seller: data.checked });
    }
  };
  checkPass(x){
    if (x.length > 1){
      return true
    }
    return false
  }
  loadNext(){
    this.setState({ activeItem: "prefer" });
  }
  validateLoginForm(){
    // this function makes a call to our backend with the current email in the box
    // TODO call the backend from here
    var validated = true
    if (!this.state["email"]){
      validated = false
      this.setState({
        errEmail: true
    });
    } 
    if (!this.state["password"]){
      validated = false
      this.setState({
        errPassword: true
    });
    } 
    if (validated){
      //console.log(36)
      var response = this.loginBackendUser()
      // if token not valid 
      // if response not valid throw an error on the page
    }
  

}
  loginBackendUser = () => {
    let email = this.state.email
    let password = this.state.password
    axios
    .post(
      endpoint + "/api/login",
      {
    email,password
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    )
    .then(res => {
      ////console.log(res.status);
      ////console.log(res);
      if (res.status == 200){
      this.props.update()
      this.props.history.push('lumber')
      } else {
        // throw an error for the program //TODO TEST THIS works
        // TODO when logout, clear the cookie from cache and browser..
      }
    });
  };
  validateForm(){
      // this function makes a call to our backend with the current email in the box
      // TODO call the backend from here
      var validated = true
      if (!(validator.isEmail(this.state.email))) {
        validated = false
        this.setState({
          errEmail: true
      });
      } 
      if (!(this.state["passwordStrength"] > 1)){
        validated = false
        this.setState({
          errPassword: true
      });
      } 
      if (this.state["Location"].length === 0){
        validated = false
        this.setState({
          errLoc: true
      });
      }
      if (!(this.state["buyer"] || this.state["seller"])){
        validated = false
        this.setState({
          errLength: true
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
    if (data.type == "lum"){
    const fav = this.state.favorites.slice()
    fav[data.index][1] = !fav[data.index][1]
    this.setState({favorites: fav})
    } else {
      const len = this.state.lengths.slice()
      len[data.index][1] = !len[data.index][1]
      this.setState({lengths: len})
    }
}
  loginUser(){
    this.setState({activeItem: "login"})
  
  }
  switchRegister(){
    this.setState({activeItem: "register"})
  }
  setLumStyle(){
    //TODO ensure first guys margin is effectively 24 
    const favorites = this.state.favorites;
    var result = [];
    for (var i = 0; i < favorites.length; ++i) {
        var margin_left = i == 0|| i == 6? "2px":"16px"
        var margin_right = i == 5? "50px":"0px"

        //console.log(favorites[i][1])
        if (favorites[i][1]){
          result.push(<Button style={{marginLeft:margin_left,marginRight:margin_right,marginBottom:"16px",height:"36px",background:"#0F4210"}} index={i} type={"lum"} onClick={this.setButton} className="cho-reg-choices" icon='check circle outline' content={favorites[i][0]} />);
        } else {
          result.push(<Button style={{marginLeft:margin_left,marginRight:margin_right,marginBottom:"16px",height:"36px",background:"#FFFFFF"}} index={i} type={"lum"} onClick={this.setButton} className="reg-choices"  content={favorites[i][0]}  /> );
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
          result.push(<Button style={{marginLeft:margin_left,marginBottom:"16px",height:"36px",background:"#0F4210"}} index={i} onClick={this.setButton} className="cho-reg-choices" icon='check circle outline' content={favorites[i][0]} />);
        } else {
          result.push(<Button style={{marginLeft:margin_left,marginBottom:"16px",height:"36px",background:"#FFFFFF"}} index={i} onClick={this.setButton} className="reg-choices"  content={favorites[i][0]}  /> );
        }
    }
    return result
  }
  loadCard(){
    //console.log(this.state.activeItem)
    if (this.state.activeItem === 'register'){
      return  <Form style={form_formatting}>
      <Form.Field style={{marginTop:"0px"}}>
        <div class="email-address"  style={{marginBottom:"6.5px"}}>Email Address:</div>
        <Form.Input  
        error={this.state.errEmail}
        value={this.state.email}
        onChange={this.onEChange}
        style={{color:"#595959",	fontFamily: "Rubik",
        fontSize: "13px",letterSpacing: ".46px",lineHeight: "17px",marginRight:"21px",width:"607px",marginBottom:"16px"}}/>
      </Form.Field>
      <Form.Field style={{marginTop:"16px",marginBottom:"0px"
    }}>
        <div class="email-address"  style={{marginBottom:"6.5px"}}>Password (at least 8 characters)</div>
        <Form.Input  type="Password" 
          error={this.state.errPassword}
          value={this.password}
          onChange={this.onPChange}
        style={{color:"#595959",	fontFamily: "Rubik",
        fontSize: "13px",letterSpacing: ".46px",lineHeight: "17px",
        marginRight:"21px",width:"607px"}}/>
        <PasswordStrengthBar onChangeScore={this.onStrengthChange} style={{marginTop:"5px",marginBottom:"0px"}} password={this.state.password} />
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
      <Form.Button color="blue" size="large" style={submit} onClick={this.loadNext} >
<div className="button-text">NEXT</div>
</Form.Button>
    </Form >
    } else if(this.state.activeItem === 'login'){
      return <Form style={form_formatting}>
      <Form.Field style={{marginTop:"0px"}}>
        <div class="email-address"  style={{marginBottom:"6.5px"}}>Email Address:</div>
        <Form.Input  
        error={this.state.errEmail}
        value={this.state.email}
        onChange={this.onEChange}
        style={{color:"#595959",	fontFamily: "Rubik",
        fontSize: "13px",letterSpacing: ".46px",lineHeight: "17px",marginRight:"21px",width:"607px",marginBottom:"16px"}}/>
      </Form.Field>
      <Form.Field style={{marginTop:"16px",marginBottom:"0px"
    }}>
        <div class="email-address"  style={{marginBottom:"6.5px"}}>Password (at least 8 characters)</div>
        <Form.Input  type="Password" 
          error={this.state.errPassword}
          value={this.password}
          onChange={this.onPChange}
        style={{color:"#595959",	fontFamily: "Rubik",
        fontSize: "13px",letterSpacing: ".46px",lineHeight: "17px",
        marginRight:"21px",width:"607px"}}/>
      </Form.Field>
      <Form.Button color="blue" size="large" style={{marginRight: "519px",marginTop: "22px",marginBottom: "42px",background: "#3F691A"}} 
onClick={this.validateLoginForm} >
<div className="button-text">LOGIN</div>
</Form.Button>
      </Form>
    }
    let return_lum = this.setLumStyle()
    let return_len = this.setLenStyle()
    return <Form style={pref_formatting}>
                <Form.Group widths='equal' inline style={{marginLeft:"3px"}}>
                <Form.Input     
                error={this.state.errBuyer}>
                <Form.Checkbox 
                name={'buyer'}
                value={this.state.buyer}
                onChange={this.onTypeChange}
                label='Buyer' />
                </Form.Input>
                <Form.Input
                error={this.state.errSeller}
                >
                <Form.Checkbox 
                name={'seller'}
                value={this.state.seller}
                onChange={this.onTypeChange}
                label='Seller' />
                </Form.Input>
                </Form.Group>
                <Form.Field style={{marginTop:"16px",marginLeft:"3px"}}>
                <div class="email-address"  style={{marginBottom:"6.5px"}}>Preferred Lumber:</div>
                {return_lum}
                </Form.Field>
                <Form.Field style={{marginTop:"16px"}}>
                <div class="email-address"  style={{marginBottom:"6.5px"}}>Preferred Length:</div>
                {return_len}
                </Form.Field>
                <Button  className="button-text"
                style={{width:"120px",height: "42px",marginLeft:"0px",marginTop:"2px",marginBottom:"16px"}}   onClick={this.validateForm}  
                content="REGISTER">
                </Button>
                <Card.Content>
                <div style={{marginLeft:"4px",marginBottom:"18px"}} className="register">By clicking Register, you agree to our <Link style={{color: "#f47373"}}>
                  Terms of Use and Privacy Policy</Link></div>
                </Card.Content>
      </Form>
  }
  loadBottom(){
    if (this.state.activeItem != "login"){
    return <div style={{display:"flex",height:"55px"}}>
      <div class="sign-in"> Already have an account? <Link to='/' onClick={this.loginUser} style={{color: "#f47373"}}><u>Sign in</u></Link></div>
      <Button floated='right' size="large" 
      style={{background:"#FFFFFF",float:"right",height:"42px",width: "120px",marginBottom:"13px",	
      boxShadow: "0 2px 3px 0 rgba(0,0,0,0.2)"}}
      onClick={this.handleClose}>
<div className="button-text" style={{color: "#f47373"}}>CANCEL</div></Button>
      </div>
  }
  return <div style={{display:"flex",height:"55px"}}>
  <div class="sign-in"> Already have an account? <Link to='/' onClick={this.switchRegister} style={{color: "#f47373"}}><u>Register</u></Link></div>
  <Button floated='right' size="large" 
  style={{background:"#FFFFFF",float:"right",height:"42px",width: "120px",marginBottom:"13px",	
  boxShadow: "0 2px 3px 0 rgba(0,0,0,0.2)"}}
  onClick={this.handleClose}>
<div className="button-text" style={{color: "#f47373"}}>CANCEL</div></Button>
  </div>
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
    let bottomcard = this.loadBottom()
    let myMenu = this.loadMenu()

    return (
      <div className='NavBar'>
      <Menu style={mynav} borderless={true}>
          <Menu.Item style={navbar} className=".ui.table" >
          <Link to={"/"} style={lip}>
        Lumber.io
        </Link>

        </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item style={navbar}>
            Product
            </Menu.Item>
            <Menu.Item style={navbar}>
            Testimonials
            </Menu.Item>
            <Menu.Item style={navbar}>
            Contact
            </Menu.Item>
            <Menu.Item header >
            
            <Portal
            closeOnTriggerClick
            openOnTriggerClick
            trigger={
              <Button content='Login/Sign In' style={greenBut} />
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
             {bottomcard}
            </Card>
            </div>
          </Portal>
            </Menu.Item>
            </Menu.Menu>
      </Menu>
      <Portal
      open={this.state.emailOpen}
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

export default NavBar;
