import React, { Fragment, Component  } from 'react';
import "./App.css";
import { withRouter, BrowserRouter as Router, Switch, Route, Link, Redirect  } from 'react-router-dom';
import Cookies from 'js-cookie';
/* In App Views */
import Profile from './InappViews/Profile';
import Footer from './InappViews/footer'
import Info from './Info';
import Orders from './Order';
import Checkout from './InappViews/checkout';
import BestDeals from './InappViews/bestdeals';
import InMenu from './InappViews/inMen';
/* Entry Views */
import CentralText from './EntryViews/CentralText';
import NavBar from './EntryViews/Menu';

const mydriverboundry = {
    margin: "auto",
};
const NotFound = () => <div>Not found</div>

const NotFoundRedirect = () => <div />
class App extends Component {
  constructor(props) {
    super(props)
    // we track the zipcode in state because we need to pass this onto the next page we load
    this.state = {
      page: '',
    };
  }
      // our send data function sets the state correctly to use the data passed on by the child component
    updateCurrentBundle(value){
      //console.log(value,999999)
      this.setState({
        bundle:value
      });
    }
  auth(){
    let value = Cookies.get('session_token')
    //console.log(value)
    if (!value){
      return <Switch>
      <Route exact path ='/' render={(props) => 
      <div>
      <NavBar {...props} update={this.auth.bind(this)}/>
      <CentralText {...props}  />
      </div>
      } 
      />
      <Route component={NotFoundRedirect} />
      </Switch>
    } 
    return <Switch>
    <Route exact path ='/' render={(props) => 
    <div>
    <NavBar {...props} update={this.auth.bind(this)}/>
    <CentralText {...props}  />
    </div>
    } 
    />
    <Route exact path ='/lumber' render={(props) => 
    <div >
    <InMenu {...props} />
    <div style={{ marginTop: "0px",marginRight: "0px", background: "#F6F7F6",width: "1450px"}}>
    <BestDeals {...props} sendBundle={this.updateCurrentBundle.bind(this)} />
    <Footer/>
    </div>
    </div>
    }/>
    <Route exact path ='/profile' render={(props) => 
    <div>
    <InMenu {...props} />
    <div style={{ marginTop: "0px",marginRight: "0px", background: "#F6F7F6",width: "1450px"}}>
    <Profile {...props}  />
    <Footer/>
    </div>
    </div>
    }/>
      <Route exact path ='/orders' render={(props) => 
    <div>
    <InMenu {...props} />
    <div style={{ marginTop: "0px",marginRight: "0px", background: "#F6F7F6",width: "1450px"}}>
    <Orders {...props}/>
    <Footer/>
    </div>
    </div>
    }/>
       <Route path ='/wood' render={(props) => 
    <div style={{ marginTop: "0px",marginRight: "0px", background: "#F6F7F6",width: "1450px"}}>
    <Info {...props} bundleData={this.state.bundle}/>
    </div>
    }/>
        <Route path ='/check:id' render={(props) => 
        <div >
            <Checkout {...props} bundleData={this.state.bundle} />
        </div>
    }/>
    <Route component={NotFoundRedirect} />
    </Switch>

    
    
  }
render () {
    const { redirect  } = this.state;
    const login = this.auth()
    return (
        <Router>
        <div className="myroot">
{login}
    </div>
    </Router>
)};
}
export default withRouter(App);
