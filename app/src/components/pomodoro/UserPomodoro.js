/**
 * Created by tvaisanen on 11/17/17.
 */

import React, {Component} from 'react';
import {Col, Glyphicon, Table, Row} from 'react-bootstrap';
import {toggle_pomodoro_state} from './commons';

class UserPomodoro extends Component {

    constructor(props) {
        super(props);
        this.state = {
            size: props.size,
            view_map: {
                sm: this.users_sm,
                md: this.users_md,
                lg: this.users_lg
            }
        };

        this.users_lg = this.users_lg.bind(this);
        this.users_md = this.users_md.bind(this);
        this.users_sm = this.users_sm.bind(this);

        this.get_view = this.get_view.bind(this);
    }

    users_lg(users) {
        return <Table responsive>
            <thead>
            <tr>
                <th>users_lg</th>
                <th>Name</th>
                <th>Active Pomodoro</th>
                <th>Today's progress</th>
            </tr>
            <Row sm={2} md={6} lg={8}></Row>

            </thead>
            <tbody>
            {users.map((user) =>
                <tr>
                    <td ><Glyphicon id="control" glyph="play-circle" onClick={() => {
                        console.log(user);
                        toggle_pomodoro_state(user);
                    }}/>
                        <Glyphicon glyph="user"/></td>
                    <td className={`pomodoro_${user.pomodoro_state}`}>{user.name}</td>
                    <td>
                        <div id={`progress_${user.id}`} className="progress"></div>
                    </td>
                    <td>{user.progress}</td>

                    <div id="info"></div>
                </tr>
            )}
            </tbody>
        </Table>
    };

    users_md(users) {
        return <div>
            <h1>users_md</h1>
            {users.map((user) =>
                <div>
                    <div><Glyphicon id="control" glyph="play-circle" onClick={() => {
                        console.log(user);
                        toggle_pomodoro_state(user);
                    }}/>
                        <Glyphicon glyph="user"/></div>
                    <td className={`pomodoro_${user.pomodoro_state}`}>{user.name}</td>
                    <td>
                        <div id={`progress_${user.id}`} className="progress"></div>
                    </td>
                    <div>{user.progress}</div>

                    <div id="info"></div>
                </div>
            )}
        </div>
    };

    users_sm(users) {
        return <div>
            <h1>users_sm</h1>
            {users.map((user) =>
                <Table responsive>

                    <Row>
                        <Col sm={4}>
                            <Glyphicon id="control" glyph="play-circle" onClick={() => {
                                console.log(user);
                                toggle_pomodoro_state(user);
                            }}
                            />
                        </Col>
                        <Col sm={4}>
                            <Glyphicon glyph="user"/>
                        </Col>
                    </Row>

                    <Row>
                        <div className={`pomodoro_${user.pomodoro_state}`}>{user.name}</div>
                    </Row>
                    <Row>
                        <div id={`progress_${user.id}`} className="progress"></div>
                    </Row>

                    <div id="info"></div>

                </Table>
            )}
        </div>
    };

    get_view(props) {
        return this.state.view_map[props.size];
    }

    render() {
        console.log(this.state);
        return this.get_view(this.props);
    }
}

UserPomodoro.propTypes = {
    size: React.PropTypes.string, // FIXME: render default if not ?
    user: React.PropTypes.object.isRequired
};