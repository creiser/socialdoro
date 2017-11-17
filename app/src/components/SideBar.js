import React, {Component} from 'react';
import {NavLink, Link} from 'react-router-dom';
import {Nav, Row, Glyphicon} from 'react-bootstrap';
import { iconNavLink } from './utils';

const sideNavItems = [
    {id: 2, path: "/pomodoros", glyph: "tasks"},
];

const rowStyle = {paddingTop: 20, fontSize: 30, color: '#000000'};

class SideBar extends Component {
    render() {
        return (

            <div>
                {sideNavItems.map((item) =>
                    <Row style={rowStyle} key={item.id}>
                        {iconNavLink(item.path, item.glyph)}
                    </Row>
                )}
            </div>
        )
    }
}

export default SideBar;