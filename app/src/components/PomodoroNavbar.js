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
		var displayStyle = this.props.userLogged ? 'block' : 'none';
		
        return <Navbar inverse collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">Social Pomodoro</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav style={{display: displayStyle}}>
                    <NavItem eventKey={1} href="#live">Personal</NavItem>
                    <NavItem eventKey={2} href="#overview">Friends</NavItem>
                </Nav>
                <img width="40" height="40"
                     style={{float: "right", borderRadius: "25px", marginLeft: "20px", marginTop: "5px", display: displayStyle}}
                     src={this.props.userIcon}
                     onClick={this.props.onImageClick}/>
                <Nav pullRight style={{display: displayStyle}}>
                    <NavDropdown eventKey={3} title={this.props.userName} id="basic-nav-dropdown">
                        <MenuItem eventKey={3.1} >Settings</MenuItem>
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