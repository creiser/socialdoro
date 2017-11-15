/**
 * Created by tvaisanen on 4/8/17.
 */

import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Navbar, NavDropdown, Nav, NavItem, MenuItem, Glyphicon, Tooltip, OverlayTrigger} from 'react-bootstrap';
import { iconNavLink, iconLinkTooltip, tooltip } from './utils';

import FacebookLogin from 'react-facebook-login';

const responseFacebook = (response) => {
  console.log(response);
}

class TopBar extends Component {
    render() {
        return (
            <Navbar>
                {header}
                <Navbar.Collapse>
                <Nav pullRight>
                    {/* Make util */}
                    <FacebookLogin
                            appId="157311708336316"
                            autoLoad={true}
                            fields="name,email,picture"
                            callback={responseFacebook}
                            cssClass="my-facebook-button-class"
                            icon="fa-facebook"
                        />
                    <OverlayTrigger placement="left" overlay={tooltip('notification-tip', 'Notifications')}>
                        <NavItem eventKey={1} href="#"><Glyphicon glyph="bell"/></NavItem>
                    </OverlayTrigger>
                    {dropdown}
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default TopBar;

const header =
    <Navbar.Header>
        <Navbar.Brand>
            {iconNavLink("/blueprint", "time")}
        </Navbar.Brand>
    </Navbar.Header>

const dropdown =
    <NavDropdown eventKey={3} title={<Glyphicon glyph="cog"/>} pullRight id="basic-nav-dropdown">
        <MenuItem eventKey={3.1}><Glyphicon glyph="user"/> View profile</MenuItem>
        <MenuItem eventKey={3.2}><Glyphicon glyph="flash"/> Upgrade plan</MenuItem>
        <MenuItem divider/>
        <MenuItem eventKey={3.3}><Glyphicon glyph="triangle-right"/> Sign out</MenuItem>
    </NavDropdown>
