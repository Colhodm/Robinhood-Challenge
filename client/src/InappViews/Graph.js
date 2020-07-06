import React, { Component } from "react";
import axios from "axios";
import 'zingchart/es6';
import ZingChart from 'zingchart-react';
import 'zingchart-react/dist/modules/zingchart-depth.min.js';
import {
  Header,
} from "semantic-ui-react";
let endpoint = "http://35.227.147.196:8080/";
 
class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
        config: {
            type: 'line',
            plot: {
                aspect: "spline"
              },
              'scale-x': {
                label: { /* Add a scale title with a label object. */
                  text: "Time",
                },
                /* Add your scale labels with a labels array. */
              },
              'scale-y': {
                label: { /* Add a scale title with a label object. */
                  text: "Share Price",
                },
                /* Add your scale labels
                 with a labels array. */
              },
          }
    };
    this.timer = setInterval(()=> this.getPerformances(), 1000)
  }
  componentDidMount() {
    this.getPerformances();
  }
  getPerformances = () => {
    let ticker = this.props.match.params.ticker;
    axios
      .post(
        endpoint + "api/fetchdata",
        {
          ticker
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        this.setState({
          config: {
            type: 'line',
            plot: {
                aspect: "spline"
              },
              plotarea: {
                'adjust-layout': true /* For automatic margin adjustment. */
              },
              'scale-x': {
                label: { /* Add a scale title with a label object. */
                  text: "Time(s)",
                },
                /* Add your scale labels with a labels array. */
              },
              'scale-y': {
                label: { /* Add a scale title with a label object. */
                  text: "Share Price ($)",
                },
                /* Add your scale labels with a labels array. */
              },
            series: [{
              values: res.data
            }]
          },
        });
      });
  };
  render() {
    return (
      <div style={{marginTop:"100px",marginLeft:"100px"}}>
      <Header> {this.props.match.params.ticker} </Header>
        <ZingChart data={this.state.config}/>
      </div>
    );
  }
}
export default Graph;
