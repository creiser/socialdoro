/**
 * Created by tvaisanen on 4/9/17.
 */

import React from 'react';
import { Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import {
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
} from 'react-bootstrap'


export const tooltip = (id, message) => (
    <Tooltip id={id}>{message}</Tooltip>
);

export const iconNavLink = (path, iconName) => <NavLink exact to={path}><Glyphicon glyph={iconName}/></NavLink>

export const iconLinkTooltip = (path, iconName, notificationId, notificationMsg) =>
                    <OverlayTrigger placement="left" overlay={tooltip({notificationId}, {notificationMsg})}>
                        { iconNavLink({path}, {iconName}) }
                    </OverlayTrigger>

export function FieldGroup({id, label, help, ...props}) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}
