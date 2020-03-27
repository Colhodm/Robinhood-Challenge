import React, { Component } from "react";
import { Button } from 'semantic-ui-react'

const style = {
    button: {
        background: "White",
        position: 'absolute',
        left: '50%',
        marginLeft: '-50px',
    },
}
class AddData extends Component{
  constructor(props) {
    super(props);
  }
  onSubmit = () => {
          this.props.createData();
  };
    render() {
        return (
            <Button style={style.button} label="Add Data" onClick={this.onSubmit}/>
        )
    }
}
export default AddData