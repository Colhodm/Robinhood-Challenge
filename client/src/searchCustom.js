import _ from "lodash";
import React, { Component } from "react";
import { Search, Grid, Header, Segment } from "semantic-ui-react";
import axios from "axios";
const initialState = { isLoading: false, results: [], value: "" };
let endpoint = "http://35.227.147.196:8080/";

export default class SearchCustom extends Component {
  state = initialState;
  componentDidMount() {
    this.source();
  }
  source = () => {
    axios.get(endpoint + "api/getCustomers").then((res) => {
      if (res.status === 200) {
        var local = res.data.map((driver, index) => {
          // we need to put title so this renders nicely in the bar
          driver["title"] = driver.companyname;
          driver["id"] = index;
          return driver;
        });
        if (this.props.updateCustomer) {
          this.props.updateCustomer(local);
        }
        this.setState({ customers: local });
        return res.data;
      }
    });
  };
  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.companyname });
    this.props.updateParent(result, this.state.customers);
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) {
        return this.setState(initialState);
      }

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = (result) => re.test(result.title);
      this.setState({
        isLoading: false,
        // this should actually be customers but avoiding for now to avoid deletion bug when we backspace
        results: _.filter(this.state.customers, isMatch),
      });
    }, 300);
  };

  render() {
    const { isLoading, value, customers } = this.state;

    return (
      <Grid>
        <Grid.Column width={6}>
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            results={customers}
            value={value}
            {...this.props}
          />
        </Grid.Column>
      </Grid>
    );
  }
}
