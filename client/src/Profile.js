import React, { Component } from "react";
import axios from "axios";
import { Image,Grid,Card,Checkbox,Divider, Header, Form, Input,Dropdown, Icon, Label,Button,Table,Segment,List,Container } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route, Link ,Redirect } from 'react-router-dom';
let endpoint = "https://lumberio.com/";
const gridoffset = {
          marginTop: "32px",
          fontFamily: "	OverpassSemiBold",
          background: "#F6F7F6",
          paddingBottom: "40px",
          width : "1366px",

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
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        //cars:[<Car identifier={0} stateLink={this.updateState.bind(this)} />],
        types:[],
        // fix to be ful default
        favorites:[["Hardwood",false],["Softwood",false],["Maple",false],["Oak",false],
        ["Spruce",false],["Pine",false],["Fir",false],["Cedar",false],["Other",false]],
        lengths:[["1 x 3",false],["1 x 4",false],["1 x 6",false],["1 x 8",false],
        ["2 x 2",false],["2 x 4",false],["2 x 6",false]],
        auth: true,

    };
      this.setStyle = this.setStyle.bind(this);
      this.join=this.join.bind(this);
      this.setButton=this.setButton.bind(this);
      this.updatePref=this.updatePref.bind(this);
      this.updateLength=this.updateLength.bind(this);
      this.deleteLength=this.deleteLength.bind(this);
      //console.log(this.state.favorites)

  }
  componentDidMount() {
    this.getPreferences();
  }
  updatePref = () => {
    //console.log(66)
	  let Lumber = this.state.favorites
	  let Length = this.state.lengths
	  axios.post(endpoint + "auth/api/profileupdate",{Lumber,Length},
		  {
		  withCredentials: true,
		  headers:{
		'Content-Type': 'application/x-www-form-urlencoded'  
		  }
		  }
    ).then(res => {
    if (res.status == 200) {
	    //TODO come up with some confirmation mechanism and actually verify the password
    }
  });
};
  getPreferences = () => {
	  axios.get(endpoint + "auth/api/profilefetch",{
		  withCredentials: true,
    }).then(res => {
     if (Object.values(res.data[5])[1] != null) {
      this.setState({
        favorites: Object.values(res.data[5])[1],
        lengths: Object.values(res.data[6])[1],
      });
    } else {
    }
  });
};
  deleteLength  = (event, {value}) => {
	  let selection_name = value
	  var temp = this.state.lengths
	  this.state.lengths.forEach(function (item, index) {
		  //console.log(item,selection_name)
		  if (item[0] == selection_name){
			  //console.log(36789314159)
		  temp[index][1] = !(temp[index][1])
	  	  }  
	  });
      this.setState({
       lengths: temp,
      });
  } 
  updateLength  = (event, {value}) => {
	 //console.log(event.target,value)
	  let selection_name = event.target.textContent;
	  var temp = this.state.lengths
	  this.state.lengths.forEach(function (item, index) {
		  //console.log(item,selection_name)
		  if (item[0] == selection_name){
			  //console.log(36789314159)
		  temp[index][1] = !(temp[index][1])
	  	  }  
	  });
      this.setState({
       lengths: temp,
      });
  }
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
    setButton = (e, data) => {
      // access to e.target here
      //console.log(data,data.index);
      const fav = this.state.favorites.slice()
      fav[data.index][1] = !fav[data.index][1]
      this.setState({favorites: fav})
  }
    setStyle(){
      //TODO ensure first guys margin is effectively 24 
      const favorites = this.state.favorites;
      //console.log(favorites,favorites[0])
      var result = [];
      for (var i = 0; i < favorites.length; ++i) {
          var margin_left = i == 0? "24px":"16px"
          //console.log(favorites[i][1])
          if (favorites[i][1]){
            result.push(<Button style={{marginBottom:"8px",marginLeft:margin_left,background:"#3F691A"}} index={i} onClick={this.setButton} className="success-check-wood" icon='check circle outline' content={favorites[i][0]} />);
          } else {
            result.push(<Button style={{marginLeft:margin_left,background:"#FFFFFF"}} index={i} onClick={this.setButton} className="fail-check-wood"  content={favorites[i][0]}  /> );
          }
      }
      return result
    }
   setDefault(){
	  var my_lst = []
	  this.state.lengths.forEach(function (item, index) {
		  if (item[1]){
	  	  my_lst.push(String(item[0]))
		  }  
	  });
	return my_lst
   }
    render() {
      let return_array = this.setStyle()
      let default_val = this.setDefault()
    return (
<div>
<Grid fluid divided='vertically' style={gridoffset}>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <h1  style={{marginLeft: "46px",marginBottom: "0px",width: "129px",height: "35px"}} class='edit-profile'>Edit Profile</h1>
                    <h2  style={{marginLeft: "46px",marginTop: "0px"}} class='short-description'>Short Description</h2>
                    <Card style={{marginLeft:"46px",width:"637px",height:"467px"}}>
                        <h1 class="details" style={{marginLeft:"10px",marginTop:"16px",marginBottom:"16px"}}>Details</h1>
                      <Form>
                      <Form.Field>
                          <div class="email-address" style={{marginLeft:"10px",marginBottom:"7.5px"}}>Name:</div>
                          <input style={{marginLeft:"10px",marginRight:"21px",width:"607px"}}/>
                        </Form.Field>
                        <Form.Field style={{marginTop:"16px"}}>
                          <div class="email-address"  style={{marginLeft:"10px",marginBottom:"7.5px"}}>Email Address</div>
                          <input style={{marginLeft:"10px",marginRight:"21px",width:"607px"}}/>
                        </Form.Field>
                        <Form.Field style={{marginTop:"16px"}}>
                          <div class="email-address"  style={{marginLeft:"10px",marginBottom:"7.5px"}}>Password</div>
                          <input style={{marginLeft:"10px",marginRight:"21px",width:"607px"}}/>
                        </Form.Field>
                        <Form.Field style={{marginTop:"16px"}}>
                          <div class="email-address"  style={{marginLeft:"10px",marginBottom:"7.5px"}}>Street address and/or postal code (postal)</div>
                          <input style={{marginLeft:"10px",marginRight:"21px",width:"607px"}}/>
                        </Form.Field>
                        <Form.Field style={{marginTop:"16px",marginBottom:"31px"}}>
                          <div class="email-address"  style={{marginLeft:"10px",marginBottom:"7.5px"}}> Phone number (optional) </div>
                          <input style={{marginLeft:"10px",marginRight:"21px",width:"607px"}}/>
                        </Form.Field>
                      </Form>
                    </Card>
                    <Form style={{marginLeft:"46px",width:"372px"}}>
                    <Form.Field>
                          <div style={{marginBottom:"7.5px"}} class="email-address"  >Verify your current password to save changes</div>
                          <input/>
                        </Form.Field>
                        <div>
                        <Button onClick={this.updatePref}  className="group">SAVE CHANGES</Button>
                        <Button className="cancel">CANCEL </Button>
                            </div>
                    </Form>
                    </Grid.Column>
                    <Grid.Column>
                    <Card style={{marginTop:"84px",marginLeft:"16px",marginRight:"29px",width:"637px",marginBottom:"0px",height:"268px"}}>
                    <Form style={{marginLeft:"24px",marginTop:"16px",marginBottom:"16.5px"}}>
                    <div class="lumber-preferences" style={{marginBottom:"8px"}}> 
                        Lumber Preferences
                    </div>
                    <div>
                      {return_array}
                    </div>
        <Form.Field>
            <div class="lumber-preferences" style={{marginBottom:"6.83px"}}> 
                Length Preferences
            </div>
        <Form.Dropdown style={{marginLeft:".5px",marginBottom:"16.5px",marginRight:"394.5px",width:"308px"}}
        placeholder='Select Length(ft)'
        fluid
	clearable={true}
        multiple selection
        options={friendOptions}
	value={default_val}
	onLabelClick={this.deleteLength}
	onChange={this.updateLength}
  />
        </Form.Field>    
        </Form>
                    </Card>
                    <Card style={{marginTop:"16px",marginLeft:"16px",marginRight:"29px",marginBottom:"0px",width:"637px",height:"120px"}}>
                    <div class="email">Email</div>
                    <Form>
                    <Form.Field style={{marginLeft:"26px",marginRight:"0px",marginBottom:"39px",width:"613px"}}>
                        <Checkbox style={{fontSize:"16px",fontHeight:"24px"}} className="terms" label='Yes, I would like lumber.io to contact me about new bundles and other
                        promotional information' />
                        </Form.Field>
                        </Form>
                    </Card>
                    <Card style={{marginTop:"16px",marginLeft:"16px",marginRight:"29px",width:"637px",height:"108px"}}>
                    <div style={{marginTop:"17px",marginLeft:"21px",marginRight:"377px"}}>
                    <div class="payment-method">Payment Method </div> <span class="change-copy"> Change </span>
                    </div>
                    <Divider style={{marginTop:"10px",marginBottom:"9px"}}/>
                   <Card.Description  style={{marginLeft:"32px",marginBottom:"18px"}}>
                       <Icon size="large" name="cc visa">
                       </Icon>
                       <span class="ending-card" >Ending in 0001</span>
                   </Card.Description>
                    </Card>
                    </Grid.Column>
            </Grid.Row>
  </Grid>
    </div>
)

}
}
export default Profile;
