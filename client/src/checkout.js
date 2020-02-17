import React, { Component } from "react";
import axios from "axios";
import {Grid,Card,Divider,Icon,Button,Menu,Popup,Portal,Form  } from "semantic-ui-react";
import { Link,Redirect  } from 'react-router-dom';
let endpoint = "http://35.227.147.196:8080/";
const gridoffset = {
          marginTop: "24px",
          fontFamily: "	OverpassSemiBold",
          background: "#F6F7F6",
          paddingBottom: "40px",
          width : "1366px",

};
const form_formatting = { marginLeft: "36px", marginRight: "32px",marginTop: "25px" };
const submitButton = {
  marginRight: "519px",
  marginBottom: "42px",
  background: "#3F691A"
};
const friendOptions = [
    {
      key: '1x3',
      text: '1 x 3',
      value: '1 x 3',
      image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
    },
    {
        key: '1x4',
        text: '1 x 4',
        value: '1 x 4',
        image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
    },
    {
        key: '1x6',
        text: '1 x 6',
        value: '1 x 6',
      image: { avatar: true, src: '/images/avatar/small/stevie.jpg' },
    },
    {
        key: '1x8',
        text: '1 x 8',
        value: '1 x 8',
      image: { avatar: true, src: '/images/avatar/small/christian.jpg' },
    },
    {
        key: '2x2',
        text: '2 x 2',
        value: '2 x 2',
      image: { avatar: true, src: '/images/avatar/small/matt.jpg' },
    },
    {
        key: '2x4',
        text: '2 x 4',
        value: '2 x 4',
      image: { avatar: true, src: '/images/avatar/small/justen.jpg' },
    },
    {
        key: '2x6',
        text: '2 x 6',
        value: '2 x 6',
      image: { avatar: true, src: '/images/avatar/small/justen.jpg' },
    },
  ]
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
};
const navbar = {
  color: "#759E33",
  fontFamily: "Overpass",	
  fontSize: "16px",	
  fontWeight: 600,
  lineHeight: "25px",
  marginLeft: "13px",
  marginTop: "9px",
  marginBottom: "0px",
};
const call = {
  height: "24px",	
    width: "333px",	
    color: "#BBBBBB",	
    fontFamily: "Rubik",	
    fontSize: "20px",	
    letterSpacing: "0.71px",
    marginTop: "29px",
    marginLeft: "352px",
    marginRight: "24px",
    lineHeight: "24px",
    whiteSpace: "nowrap",
};
const gridS = {
  height: "74px",	
  width: "1366px",	
};
const tabs = {
  height: "60px",	
  width: "206px",	
};
const phone= {
  color: "#3F691A",
};
const tabText = {
  width: "109px",	
    color: "#595959",	
    fontFamily: "Rubik",	
    fontSize: "16px",	
    letterSpacing: "0.57px",	
    lineHeight: "19px",	
    marginTop: "21px",
    marginBottom: "20px",
    textAlign: "center"};
const buttonStyle = {
      marginRight: "24px",
      marginLeft: "1000px",
      marginTop: "5px",
      marginBottom: "20px",
      height: "45px",	
      width: "136px",
      fontFamily: "Rubik",
      fontSize: "16px",
      letterSpacing: "0.57px",
      lineHeight: "19px",
      background: "#F6F7F6",
      color: "#595959",
      fontWeight: "400",
    };
const border_select = {
      borderBottom: "2px solid #3F691A",
      marginLeft: "32px",
    };
// Link to the home page, but keep signed in when clicking on Lumber.io but log out purely
// when using the logout button
function MenuBar(props) {
  return (
    <div>
    <Grid fluid padded={false} columns={2} style={gridS}>
      <Grid.Row fluid stye={greenBut}>
      <Grid.Column>
      <Link to={"/lumber"} style={navbar}>
    Lumber.io
    </Link>
    </Grid.Column>
    <Grid.Column >
      <div style={call}>              Call <span style={phone}>778-329-3030</span> for assistance </div>
          </Grid.Column>
  </Grid.Row>
  </Grid>
  <Menu  fluid style={{marginTop: '19px', boxShadow: "none",border: "none",}}>
  <Menu.Item style={tabs}>
  <div style={border_select}>
    <div style={tabText}>
        Summary
        </div>
        </div>

  </Menu.Item >
  <div style={{width: '1160px'}}>
  <Link to={"/"}>
  <Button style={buttonStyle} floated='right'>
            Log Out
          </Button>
  </Link>
        </div>
  </Menu>
  </div>
  );
}
class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
        orderInfo:[],
        emailOpen: false,
        address:{
          name:"First Name Last Name",
          unit:"1234-00",
          street:"Crescent Street",
          city:"Toronto",
          state:"Ontario 1A2 3B4",
          country:"Canada",
          phone:"778-123-1234",
          prompt:false,
        },
    };
      this.join=this.join.bind(this);
      this.closeEmail=this.closeEmail.bind(this);
      this.closeAddress=this.closeAddress.bind(this);
      this.fillAddress=this.fillAddress.bind(this);
      this.validateAddress=this.validateAddress.bind(this);
      this.changeAddress=this.changeAddress.bind(this);



  }
  componentDidMount() {
    this.getAddress();
  }
  getAddress = () => {
    console.log("called the function")
    axios.get(endpoint + "auth/api/address",{
        withCredentials: true,
    }).then(res => {
    //console.log(Object.fromEntries(res.data["address"]),6666666)
    if (res.status === 200 && res.data) {
      var temp = {}
        Object.entries(res.data).map(obj => {
          console.log(obj[1].Key,obj[1].Value)
          temp[obj[1].Key] = obj[1].Value
        })
        console.log(temp,898989898)
        this.setState({
          address: temp
      });
    } 
  });
};
  doCheckout = () => {
    let address = this.state.address
    let bundle_info = this.props.bundleData
	  axios.post(endpoint + "auth/api/checkout",
		  {
		  address,bundle_info
		  }
    ,{
      headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
		  withCredentials: true,
    }).then(res => {
    console.log(res)
    if (res.status == 200){
      this.setState({ emailOpen: true })
    } else {
      this.setState({ emailOpen: false })
    }
  });
};
  handleOpen = () => {
    this.setState({ emailOpen: true })
  }
  updateEmail = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ email: value.target.value });
    console.log(value.target.value)
  };
  fillAddress(){
    this.setState({ 
      addressOpen: true,
      emailOpen: false })
  }
  onFNChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ firstname: value.target.value });
  };
  onUnitchange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ unit: value.target.value });
  };
  onLNChange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ lastname: value.target.value });
  };
  onAddresschange = (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ myAddress: value.target.value });
  };
  onCitychange= (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ city: value.target.value });
  };
  onStatechange= (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ stateName: value.target.value });
  };
  onCountrychange= (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ country: value.target.value });
  };
  onPhonechange= (value) => {
    // TODO if its an invalid email we can prompt them for an error later
    this.setState({ phone: value.target.value });
  };

  join(){
      // this function makes a call to our backend with the current email in the box
      // TODO call the backend from here
      console.log(this.state["email"])
  }
    sendData(data) {
        this.props.buttonClick(data);
    };
    closeEmail = () => {
      this.setState({ emailOpen: false })
    }  
    closeAddress = () => {
      this.setState({ addressOpen: false })
    }  
    closeAdd = () => {
      var temp = Object.assign({},this.state.address)
      temp.prompt = true
      this.setState({ address: temp })
    }  
    validateAddress = () =>{
      return true
    }
    changeAddress(){
      console.log(222222)
      if (this.validateAddress()) {
      var temp = {}
      temp.name = this.state.firstname + ' ' + this.state.lastname
      temp.unit = this.state.unit
      temp.street = this.state.myAddress
      temp.city = this.state.city
      temp.state = this.state.stateName
      temp.country = this.state.country
      temp.phone = this.state.phone
      temp.prompt = true
      this.setState({ 
        address: temp,
        addressOpen: false
      })
    }
  }
    panel(){
      return <Portal
      open={this.state.addressOpen}
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
                marginLeft: '519px',
                marginRight: '518px',
                position: 'relative',
                top: '196px',
                background: '#FFFFFF',
                zIndex: 1,
              }}
            >   
          <Form style={form_formatting}>
          <Form.Group widths='equal'>

          <Form.Input
        error={this.state.errFirstName}
        value={this.state.firstname}
        onChange={this.onFNChange}
        style={{color:"#595959",	fontFamily: "Rubik"}}
        placeholder='First name'
        fluid label='First name'
        />

        <Form.Input   
          error={this.state.errLastName}
          value={this.lastname}
          onChange={this.onLNChange}
        style={{color:"#595959",	fontFamily: "Rubik",}}
        placeholder='Last Name'
        fluid label='Last Name'
        />
          </Form.Group>
          <Form.Group widths='equal'>
          <Form.Input   
          error={this.state.errUnit}
          value={this.unit}
          onChange={this.onUnitchange}
        style={{color:"#595959",	fontFamily: "Rubik",}}
        placeholder='201'
        fluid label='Unit Number'
        />
          <Form.Input   
          error={this.state.errAddress}
          value={this.myAddress}
          onChange={this.onAddresschange}
        style={{color:"#595959",	fontFamily: "Rubik",}}
        placeholder='6666 Park Plaza Street'
        fluid label='Street Address'
        />
        
            <Form.Input   
          error={this.state.errCity}
          value={this.city}
          onChange={this.onCitychange}
        style={{color:"#595959",	fontFamily: "Rubik",}}
        placeholder='Toronto'
        fluid label='City'
        />
                  </Form.Group>
           <Form.Input   
          error={this.state.errState}
          value={this.stateName}
          onChange={this.onStatechange}
        style={{color:"#595959",	fontFamily: "Rubik",}}
        placeholder='Ontario'
        fluid label='State'
        />
          <Form.Input   
          error={this.state.errCountry}
          value={this.country}
          onChange={this.onCountrychange}
        style={{color:"#595959",	fontFamily: "Rubik",}}
        placeholder='Canada'
        fluid label='Country'
        />
         <Form.Input   
          error={this.state.errPhone}
          value={this.phone}
          onChange={this.onPhonechange}
        style={{color:"#595959",	fontFamily: "Rubik",}}
        placeholder='778-329-3030'
        fluid label='Phone'
        />
           <Form.Button color="blue" size="large" style={submitButton} onClick={this.changeAddress} >
<div className="button-text"> CONFIRM </div>
</Form.Button>
      </Form>
            </Card>      
            </div>
        </Portal>
    }
    render() {    
      if (!this.props.bundleData){
        return (<Redirect to={"/lumber"}/>)
      }
      let addressPanel = this.panel()
    return (
<div>
<MenuBar/>
<div style={{ marginTop: "0px",marginRight: "0px", background: "#F6F7F6",width: "1450px"}}>
<Grid fluid divided='vertically' style={gridoffset}>
            <Grid.Row columns={2}>
                <Grid.Column>
                <Card style={{marginLeft:"33px",width:"606px",height:"137px"}}>
                  <div class='date' >
                    Guaranteed Delivery date: {this.props.bundleData.date}
                  </div>
                  <Divider style={{marginTop:"0px",marginLeft:"21px",marginRight:"24px",marginBottom:"16px"}}/>
                  <div class='type'>
                    {this.props.bundleData.type}
                    <span class='change-order'>Change</span>
                  </div>

                  <div class='seller'>
                    SOLD BY {this.props.bundleData.owner}
                  </div>
    </Card>
    <Card style={{marginLeft:"33px",width:"606px",height:"231px"}}>
                  <div class='shipping-details' >
                    Shipping Details <span class='change-order' onClick={this.fillAddress}>Change</span>
                  </div>
                  <Divider style={{marginTop:"0px",marginLeft:"21px",marginRight:"24px",marginBottom:"18px"}}/>
                  <div class='address'>
                    {this.state.address.name}
                    <br/>
                    {this.state.address.unit} {this.state.address.street}
                    <br/>
                    {this.state.address.city}, {  this.state.address.state}
                    <br/>
                    {this.state.address.country}
                    <br/>
                    Phone: {this.state.address.phone}
                    <br/>
                    <br/>
                    <span style={{marginLeft:"0px"}} class='change-order'>Add Delivery Instructions</span>
                  </div>
    </Card>
    <Card.Group itemsPerRow={2 } style={{marginLeft:"33px",marginRight:"0px",width:"606px",height:"123px"}}>
    <Card style={{marginLeft:"0px",width:"289px",height:"123px"}}>
                    <div style={{marginTop:"17px",marginLeft:"21px",marginRight:"30px"}}>
                    <div class="payment-method">Payment Method </div> <span class="change-copy"> Change </span>
                    </div>
                    <Divider style={{marginTop:"10px",marginBottom:"9px"}}/>
                   <Card.Description  style={{marginLeft:"32px",marginBottom:"18px"}}>
                       <Icon size="large" name="cc visa">
                       </Icon>
                       <span class="ending-card" >Ending in 0001</span>
                   </Card.Description>
                    </Card>
                    <Card style={{marginLeft:"13px",marginRight:"0px",width:"289px",height:"123px"}}>
                    <div style={{marginTop:"17px",marginLeft:"21px",marginRight:"30px"}}>
                    <div class="payment-method"> Billing Address </div> <span class="change-copy"> Change </span>
                    </div>
                    <Divider style={{marginTop:"10px",marginBottom:"9px"}}/>
                   <Card.Description  style={{marginLeft:"32px",marginBottom:"18px"}}>
                       <span class="ending-card" >Same as shipping address</span>
                   </Card.Description>
                    </Card>

    </Card.Group>
    </Grid.Column>
                    <Grid.Column>
                    <Card style={{marginTop:"0px",marginLeft:"16px",marginRight:"285px",width:"398px",marginBottom:"0px",height:"396px"}}>
                    <Card.Header>
                    <Button onClick={this.doCheckout} className="checkout-button"> PLACE YOUR ORDER </Button>
                    </Card.Header>
                    <div className="checkout-header">
                      Order Summary
                    </div>
                    <div className="checkout-info">
                      Items: <span class="checkout-amount">CDN$ {this.props.bundleData.itemcost}</span>
                      <br/>
                      Shipping & Handling <span class="checkout-amount">CDN$ {this.props.bundleData.shipcost}</span>
                    </div>
                    <Divider style={{marginLeft:"24px",marginRight:"22px"}}/>
                    <div className="checkout-info">
                      Total before tax: <span class="checkout-amount">CDN$ {this.props.bundleData.pretax}</span>
                      <br/>
                      Estimated GST/HST: <span class="checkout-amount">CDN$ {this.props.bundleData.gst}</span>
                      <br/>
                      Estimated PST/RST/QST: <span class="checkout-amount">CDN$ {this.props.bundleData.pst}</span>
                    </div>
                    <Divider style={{marginLeft:"24px",marginRight:"22px",marginBottom:"9px",marginTop:"9px"}}/>
                    <div class="total-header">
                      Total 
                      <div class="total-cdn">
                        CDN$ {this.props.bundleData.price}
                      </div>
                    </div>
                    <div class="savings-footer">
                      <div class="savings-checkout">
                      <Popup className="pop-up" content='On average, a lumber trader would take 7-12% commision from each trade. You save by using lumber.io'
                      trigger={<Icon name="info circle" />} />
                      <span style={{float:"right"}}>	My Savings:			CDN${this.props.bundleData.saving}</span>
                      </div>
                    </div>
                    </Card>
                    </Grid.Column>
            </Grid.Row>
  </Grid>
  </div>
  {addressPanel}
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
            <Icon  onClick={this.closeEmail}  style={{color:'#AAAAAA',marginLeft: '40px',marginRight: '346px',marginTop: '27px'}}
            size={'small'}name='close'/>    
               <Icon style={{color:'#AAAAAA',marginLeft: '167px',marginRight: '166px',marginTop: '22px'}}
            size={'huge'}name='mail outline'/>        
            <div className='email-head'>
            We sent you an email!  
            </div>  
            <div className='email-text'>
              The finer details of your order have been emailed to you!
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
        <Portal
      open={!this.state.address.prompt}
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
            <div style={{marginLeft: '23px',marginRight: '24px',marginTop: '20px'}}>
              <span className='shipping' >Choose a shipping address</span>
              <Icon  onClick={this.closeAdd}  style={{color:'#AAAAAA',marginLeft: '63px',marginTop: '4px'}}
              size={'small'}name='close'/>    
            </div>
            <div  style={{marginLeft: '26px',marginTop: '22px'} }class='address'>
                    {this.state.address.name}
                    <br/>
                    {this.state.address.unit} {this.state.address.street}
                    <br/>
                    {this.state.address.city}, {  this.state.address.state}
                    <br/>
                    {this.state.address.country}
                    <br/>
                    Phone: {this.state.address.phone}
                </div>
            <Card.Header>
            <Button  className="address"
                style={{width:"270px",height: "36px",marginLeft:"67px",marginRight:"66px",
                marginTop:"30px",
                paddingRight:"16px",paddingLeft:"16px",paddingTop:"10px"}}  
                 onClick={this.closeAdd} content="DELIVER TO THIS ADDRESS">
                </Button>
              <Button  onClick={this.fillAddress} className="change-add"
                style={{width:"271px",height: "36px",marginLeft:"67px",marginRight:"66px",
                marginTop:"15.5px",marginBottom:"42.5px",paddingRight:"16px",paddingLeft:"16px"}}  
                  >
                  <div>

                    CHANGE ADDRESS INFO
                    </div>
                </Button>
                </Card.Header>
            </Card>      
            </div>
        </Portal>
    </div>
)

}
}
export default Checkout;
