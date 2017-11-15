/**
 * Created by tvaisanen on 4/8/17.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs } from 'react-bootstrap';
import Friends from './Friends';
import MyPomodoro from './MyPomodoro';

class TabPage extends Component {
    constructor(props){
        super(props);

        this.state = {

        }
    }



  render() {
    return (
        <div>
            {tabsInstance(this.state)}
        </div>
    );
  }
}

export default connect(null, {  })(TabPage);

const tabsInstance = (props) => (
  <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
    <Tab eventKey={1} title="My Pomodoro"><MyPomodoro/></Tab>
    <Tab eventKey={2} title="Friends"><Friends/></Tab>
  </Tabs>
);
