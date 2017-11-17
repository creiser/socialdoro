/**
 * Created by tvaisanen on 11/17/17.
 */

import React, {Component} from 'react';
import {Row, Tab, Tabs, Nav, NavItem, MenuItem, NavDropdown, Navbar} from 'react-bootstrap';

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
                    <NavItem eventKey={1} href="#">Live</NavItem>
                    <NavItem eventKey={2} href="#">Overview</NavItem>
                </Nav>

            </Navbar.Collapse>
        </Navbar>;
    }
}
;

export default PomodoroNavbar;