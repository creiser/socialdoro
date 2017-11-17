/**
 * Created by tvaisanen on 4/8/17.
 */

import React, {Component} from 'react';
import {Col, Glyphicon, Table, Row} from 'react-bootstrap';

import {get_user_status} from '../actions/api_actions';
import UserPomodoro from './pomodoro/UserPomodoro';

const PomodoroState = {
    STOPPED: 'STOPPED',
    POMODORO: 'POMODORO',
    BREAK: 'BREAK'
};


const DELTA_T = 10;


let pomodoro_state = PomodoroState.STOPPED;
const POMODORO_TIME = 10; // 8 seconds
const BREAK_TIME = 4; // 2 seconds
let POMODORO_START; // start in seconds of current pomodoro
let pomodoros = []; // [start, end, start, end, ...]
let debug_start = new Date().getTime() / 1000;

const viewport_width = () => {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
};


const get_rel_time = () => {
    const time = new Date().getTime() / 1000 - debug_start;
    return time;
};


// USERS

const users = (props) => {
    return user_maps[props.size]
};

const users_lg = (users) => {
    return <Table responsive>
        <thead>
        <tr>
            <th>

            </th>
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
const users_sm = (users) => {
    return <div>
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

const user_maps = {sm: users_sm, lg: users_sm};


class Pomodoros extends Component {
    constructor(props) {
        console.log("Pomodoros.props: ");
        console.log(props);
        super(props);

        this.tick_clock = this.tick_clock.bind(this);
        this.load_statuses = this.load_statuses.bind(this);
    }

    load_statuses() {
        get_user_status(this.state.users)
    }

    tick_clock() {
        // Increment the counter
        const incr_time = this.state.counter + 1;
        this.setState({counter: incr_time})

        // bind actions to the tick
        tick(this);
    }

    componentDidMount() {
        start(this.state.users, this);
        // set app tick rate to DELTA_T
        let timer = setInterval(this.tick_clock, DELTA_T);
        this.setState({timer});
    }

    render() {
        const v = viewport_width();
        console.log("viewport width: " + v);
        let rendered_users = rendered_users
        //let rendered_users = users_lg(this.state.users);
        if (v < 400) {
            rendered_users = users_sm(this.state.users);
        }
        return (
            <div>
                <div id="info"></div>
                <hr/>

                <div id="control"></div>
                {users.map((user) => {
                   return <UserPomodoro user={user} size="md"/>
                })}
                <button id="test" onClick={this.load_statuses}>Test</button>
            </div>
        )
    }
}

UserPomodoro.propTypes = {
    size: React.PropTypes.array.isRequired,
};

export default Pomodoros;


const add_pomodoro_to_user = (user) => {
    user.pomodoros.push(user.pomodoro_start);
    user.pomodoros.push(get_rel_time());
    console.log(user.pomodoros);
}






