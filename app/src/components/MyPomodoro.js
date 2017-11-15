/**
 * Created by tvaisanen on 11/15/17.
 */


import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
    Button,
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Checkbox,
    Col,
    Row
} from 'react-bootstrap'

class MyPomodoro extends Component {
    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(evt) {
        evt.preventDefault();
        this.setState({[evt.target.id]: evt.target.value});
    }

    render() {

        return (
            <div>
            <h1>My Pomodoro</h1>
            </div>
        )
    }
}



export default MyPomodoro;

