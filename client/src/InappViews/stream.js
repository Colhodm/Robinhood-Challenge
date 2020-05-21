import React, { Component } from "react";
import axios from "axios";
import { Image,Grid,Card, Header, Form, Input, Icon, Button,Table,Segment,List,Container,Feed } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route, Link,Redirect  } from 'react-router-dom';
import Type from "./lumtype"
let endpoint = "http://35.227.147.196:8080/";
const gridoffset = {
          marginTop: "19.5px",
          textAlign:"center",
          fontFamily: "	OverpassSemiBold",
          background: "#F6F7F6",
          paddingBottom: "120px",
          width: "100%",
};
class Stream extends Component {
  constructor(props) {
    super(props);
    this.state = {
        //cars:[<Car identifier={0} stateLink={this.updateState.bind(this)} />],
        types:[],
        streamData:{zoomurl:"loading",viewers:0,artist:"Lebron James",donations:0,goal:0,storeurl:"artisttourbus.com"},
    };
      this.join=this.join.bind(this);

  }
  componentDidMount() {
    this.getPerformance();
  }
  getPerformance = () => {
    let performance_id = this.props.match.params.id
    axios
    .post(
      endpoint + "auth/api/watch",
      {
    performance_id
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
      if (res.status === 200){
        this.setState({
          streamData: Object.assign({},this.state.streamData,res.data)
        })
      }
    });
  };
updatePerformance = () => {
  axios.get(endpoint + "auth/api/updateperformance",{
      withCredentials: true,
  }).then(res => {
  //console.log(res);
  if (res.data) {
    this.setState({
      types: res.data.map(performance => {
        return (
          <Type date={performance.date} name={performance.name} url={performance.zoomurl} id={performance._id}/>
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
      console.log(this.state.streamData,"STARTING")
    return (
<div>
<Grid divided='vertically' style={gridoffset}>
    <Grid.Row columns={2}>
            <Grid.Row columns={1}>
                <Grid.Column>
                    <Card style={{marginLeft:"43px",width:"420px"}}>
                    <Card.Content>
                    <Card.Header>
                    Zoom link is {this.state.streamData.zoomurl}
                    </Card.Header>
                    <Card.Meta>
                    There are currently {this.state.streamData.viewers} watching
                    </Card.Meta>
                    <Card.Description>
                      {this.state.streamData.artist} is a musician living in Nashville.
                    </Card.Description>
                    </Card.Content>
                    <Card.Content>
                    <Feed>
        <Feed.Event>
          <Feed.Label image='/images/avatar/small/jenny.jpg'/>
          <Feed.Content>
            <Feed.Date content='1 day ago' />
            <Feed.Summary>
              Patrick Ewing joined this concert.
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>

        <Feed.Event>
          <Feed.Label image='/images/avatar/small/molly.png' />
          <Feed.Content>
            <Feed.Date content='3 days ago' />
            <Feed.Summary>
              Molly Bloom joined this concert.
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>

        <Feed.Event>
          <Feed.Label image='/images/avatar/small/elliot.jpg' />
          <Feed.Content>
            <Feed.Date content='4 days ago' />
            <Feed.Summary>
              Steve Nash joined this concert.
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
      </Feed>
      </Card.Content>
                    </Card>
                    </Grid.Column>
            </Grid.Row>
            <Grid.Column floated={"right"}>
        <Card style={{marginLeft:"430px"}}>
        <Card.Content>
                    <Card.Header>
                    Donate
                    </Card.Header>
                    <Card.Meta>
                    There has been {this.state.viewers} donations so far with a total amount of {this.state.streamData.donations}
                    </Card.Meta>
                    <Card.Description>
                      {this.state.streamData.artist} is looking to raise around {this.state.streamData.goal}.
                    </Card.Description>
                    </Card.Content>
        </Card>
        <Card style={{marginLeft:"430px"}}>
        <Card.Content>
                    <Card.Header>
                    Buy Merchandise 
                    </Card.Header>
                    <Card.Meta>
                    <Link to={this.state.streamData.storeurl}><b>{this.state.streamData.storeurl}</b></Link>
                    </Card.Meta>
                    <Card.Meta>
                    {this.state.streamData.artist} released his hottest collection for this signature VIP concert.
                    </Card.Meta>
                    <Card.Description>
                      The shirts are running out fast and there are 20 remaining.
                    </Card.Description>
                    
                    </Card.Content>
        </Card>
        <Card style={{marginLeft:"670px",marginBottom:"0px",background:"#DC99A9",width:"50px"}}>
        <Link><Icon inverted size={"big"} style={{ marginLeft:"6px",width: '31px',height: '37px' }} name='facebook'/> </Link>
        <Link><Icon  inverted size={"big"} style={{ marginLeft:"10px",width: '31px',height: '37px' }} name='instagram'/> </Link>
        <Link><Icon  inverted size={"big"} style={{ marginLeft:"10px",width: '31px',height: '37px' }} name='twitter'/> </Link>
        <Link><Icon inverted size={"big"} style={{ marginLeft:"10px",idth: '31px',height: '37px' }} name='youtube'/> </Link>
        </Card>
      </Grid.Column>
  </Grid.Row>
  </Grid>
    </div>
)

}
}
export default Stream;
