import React, { Component } from "react";
import axios from "axios";
import { Image,Grid,Card, Header, Form, Input, Icon, Segment, Container,Button} from "semantic-ui-react";
import Formx from "./Formx";


const style = {
  h1: {
    marginTop: '3em',
  },
  h2: {
    margin: '4em 0em 2em',
  },
  h3: {
    marginTop: '0em',
    padding: '0em 0em',
    // width: '50px'
  },
  last: {
    marginBottom: '300px',
  },
  segment: {
    width: '250px',
    marginLeft: '2em',
  },
}

function Entry(props) {
  return (
    <Form >
      <Form.Group inline>
    <Form.Field>
      <label>Length</label>
      <input name="length" id={props.identifier} onChange={props.updateParent}placeholder='8' />
    </Form.Field>
    <Form.Field>
      <label>Tally</label>
      <input name="tally" id={props.identifier} onChange={props.updateParent} placeholder='99' />
    </Form.Field>
    <Form.Field>
      <label>USD</label>
      <input name="USD" id={props.identifier} onChange={props.updateParent} placeholder='50' />
    </Form.Field>
    <Form.Field>
      <label>CSD</label>
      <input name="CSD" id={props.identifier} onChange={props.updateParent} placeholder='75' />
    </Form.Field>
    </Form.Group>
    </Form>
  )
}
class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data:[<Entry updateParent={this.updateParent} identifier={0}/>],
        location: '', 
        grade: '', 
        size: '', 
        raw_data:[],
        identifier: this.props.identifier,
    };
      this.addGroup=this.addGroup.bind(this);
      this.updateParent=this.updateParent.bind(this);
      this.updateParentData=this.updateParentData.bind(this);

  }
  updateParent = (e) => {
      // 1. Make a shallow copy of the items
      let temp_data = [...this.state.raw_data];
      // 2. Make a shallow copy of the item you want to mutate
      let item = {...temp_data[e.target.id]};
      // 3. Replace the property you're intested in
      let key = e.target.name
      item[key] = e.target.value;
      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      temp_data[e.target.id] = item;
      // 5. Set the state to our new copy
      this.setState({raw_data:temp_data},this.updateParentData);
}

  handleChange = (e) => 
  {
    let name = e.target.name
    this.setState({ [name]: e.target.value },this.updateParentData)
  }
  addGroup = () => {
        this.setState({
            data:this.state.data.concat([<Entry identifier={this.state.data.length} updateParent={this.updateParent}/>])
        });
    };
  updateParentData(){
    this.props.updateParent(this.state)
  }
  render() {
    // replace the Grade label with a dropdown eventually
  return (
    <div className = "carCard">
      <Header as='h3' textAlign='center' style={style.h3}/>
      <Form>
    <Form.Field>
      <label>Location</label>
      <input  name='location' value={this.state.location} placeholder='Edgewood' onChange={this.handleChange}/>
    </Form.Field>
    <Form.Field>
      <label>Grade</label>
      <input name='grade' value={this.state.grade} placeholder='Platinum' onChange={this.handleChange}/>
    </Form.Field>
    <Form.Field>
      <label>Size</label>
      <input name='size' value={this.state.size} placeholder='2x4' onChange={this.handleChange}/>
    </Form.Field>
      {this.state.data}
    <Button onClick={this.addGroup}>Add another entry</Button>
  </Form>
    </div>

  )
}
}
export default Data