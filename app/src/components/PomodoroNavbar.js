/**
 * Created by tvaisanen on 11/17/17.
 */

import React, {Component} from 'react';
import {Nav, NavItem, Navbar, NavDropdown, MenuItem} from 'react-bootstrap';

import {fbLogin} from './FBActions';

class PomodoroNavbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Navbar inverse collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">Social Pomodoro</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                    <NavItem eventKey={1} href="#live">Live</NavItem>
                    <NavItem eventKey={2} href="#overview">Overview</NavItem>
                </Nav>
                <img width="40" height="40"
                     style={{float: "right", borderRadius: "25px", marginTop: "5px"}}
                     src={this.props.userIcon}
                     onClick={this.props.onImageClick}/>
                <Nav pullRight>


                    <NavDropdown eventKey={3} title={this.props.userName} id="basic-nav-dropdown">
                        <MenuItem eventKey={3.1}>Settings</MenuItem>
                        <MenuItem divider/>
                        <MenuItem onClick={this.props.logout}>Log Out</MenuItem>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>

        </Navbar>;
    }
}
;

export default PomodoroNavbar;