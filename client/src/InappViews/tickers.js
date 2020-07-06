import React, { Component } from "react";
import axios from "axios";
import {
  Grid,
  Card,
} from "semantic-ui-react";
import Stock from "./stock";
let endpoint = "http://35.227.147.196:8080/";
const gridoffset = {
  marginTop: "19.5px",
  textAlign: "center",
  fontFamily: "	OverpassSemiBold",
  background: "#F6F7F6",
  paddingBottom: "40px",
  width: "1366px",
};
class BestDeals extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    // set to 1000 for production
    this.timer = setInterval(()=> this.getPerformances(), 1000)
    this.moreData = this.moreData.bind(this);
  }
  componentDidMount() {
    this.getPerformances();
  }
  moreData(ticker){
    this.props.history.push(ticker)
  }
  getPerformances = () => {
    let tickers = ["TSLA","GOOGL","BOX","AAPL","COP"];
    axios
      .post(
        endpoint + "api/fetchtickers",
        {
          tickers
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        // if fails indicate to user that the performance upload failed
        this.setState({
          //TODO fix this design pattern where we're recreating components, we probably want to have the children update their set async)
          tickers: res.data.map((performance) => {
            return (
              <Stock
                change={this.moreData}
                name={performance.Name}
                price={performance.Price.toFixed(2)}
              />
            );
          }),
        });
      });
  };
  sendData(data) {
    this.props.buttonClick(data);
  }
  render() {
    return (
      <div>
        <Grid divided="vertically" style={gridoffset}>
          <Grid.Row columns={1}>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Card.Group>{this.state.tickers}</Card.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
export default BestDeals;
