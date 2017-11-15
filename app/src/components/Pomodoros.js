/**
 * Created by tvaisanen on 4/8/17.
 */

import React, {Component} from 'react';
import {Glyphicon, Table} from 'react-bootstrap';

const PomodoroState = {
    STOPPED: 'STOPPED',
    POMODORO: 'POMODORO',
    BREAK: 'BREAK'
};


const DELTA_T = 1000;


let pomodoro_state = PomodoroState.STOPPED;
const POMODORO_TIME = 10; // 8 seconds
const BREAK_TIME = 4; // 2 seconds
let POMODORO_START; // start in seconds of current pomodoro
let pomodoros = []; // [start, end, start, end, ...]
let debug_start = new Date().getTime() / 1000;

const get_rel_time = () => {
    const time = new Date().getTime() / 1000 - debug_start;
    return time;
};

const users = (users) => (
    <Table responsive>
        <thead>
        <tr>
            <th>
                <div id="tick"></div>
            </th>
            <th>Name</th>
            <th>Active Pomodoro</th>
            <th>Today's progress</th>
        </tr>
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
);


class Pomodoros extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: null,
            counter: 0,
            delta_t: 0,
            users: [
                {
                    id: 0,
                    name: "Christian Reiser",
                    active_pomodoro: "",
                    progress: '2:30',
                    pomodoro_start: null,
                    pomodoro_state: PomodoroState.STOPPED,
                    pomodoros: []
                },
                {
                    id: 1,
                    name: "Toni Väisänen",
                    active_pomodoro: "",
                    progress: '1:30',
                    pomodoro_start: null,
                    pomodoro_state: PomodoroState.STOPPED,
                    pomodoros: []
                },
                {
                    id: 2,
                    name: "Foo Bar",
                    active_pomodoro: "",
                    progress: '4:30',
                    pomodoro_start: null,
                    pomodoro_state: PomodoroState.STOPPED,
                    pomodoros: []
                }
            ]
        },
        this.tick_clock = this.tick_clock.bind(this);
    }

    tick_clock(){
        // Increment the counter
        const incr_time = this.state.counter + 1;
        this.setState({ counter: incr_time })

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
        return (
            <div>
                {this.state.counter}
                {users(this.state.users)}
            </div>
        )
    }
}

export default Pomodoros;


function add_pomodoro_to_user(user) {
    user.pomodoros.push(user.pomodoro_start);
    user.pomodoros.push(get_rel_time());
    console.log(user.pomodoros);
}

const progress_bar_block = (props) => {
    return '<div style="width: ' + props.width + '%; height: 21px; background-color:' + props.bgcolor + '; float: left;"></div>';
};

const progressBar = (props) => {
    /*
    return: div element with progress_bar
     */
    let progress_html = document.createElement('div');
    for (let i = 0; i < props.pomodoros.length; i += 2) {
        let width = props.pomodoros[i + 1] - props.pomodoros[i]; // 1% = 1 second
        progress_html += progress_bar_block({width:width, bgcolor:"green"});
        if (i + 2 < props.pomodoros.length) {
            width = props.pomodoros[i + 2] - props.pomodoros[i + 1];
            progress_html += progress_bar_block({width:width, bgcolor:"red"});
        }
    }

    // current active pomodoro will be updated continously
    if (props.pomodoro_state === PomodoroState.POMODORO) {
        console.log("active update?");
        if (props.pomodoros.length) {
            let width = props.pomodoro_start - props.pomodoros[props.pomodoros.length - 1];
            progress_html += progress_bar_block({width:width, bgcolor:"red"});
        }

        let width = props.rel_time - props.pomodoro_start;
        progress_html += progress_bar_block({width:width, bgcolor:"green"});
    }
    return progress_html;
};

const toggle_pomodoro_state = (user) => {
    if (user.pomodoro_state === PomodoroState.POMODORO){
        user.pomodoro_state = PomodoroState.STOPPED;
    } else {
        user.pomodoro_state = PomodoroState.POMODORO;
    }

};

const set_pomodoro_start_time = (user) => {
    user.pomodoro_start = user.pomodoro_start + POMODORO_TIME + BREAK_TIME;
};

const checkState = (props) => {

    const user = props.user;
    const rel_time = get_rel_time();

    // conditions for changing state to break
    const working = user.pomodoro_state === PomodoroState.POMODORO;
    const rel_time_gt = rel_time > user.pomodoro_start + POMODORO_TIME;
    const set_state_break = working && rel_time_gt;

    // conditions for changing state to work
    const on_break = user.pomodoro_state === PomodoroState.BREAK && rel_time;
    const break_over = rel_time > user.pomodoro_start + POMODORO_TIME + BREAK_TIME;
    const set_state_work = on_break && break_over;

    if (set_state_break) {
        toggle_pomodoro_state(user);
        add_pomodoro_to_user(user);
    } else if (set_state_work) {
        toggle_pomodoro_state(user);
        set_pomodoro_start_time(user);
    }
};

const tick = (props) => {
    let users = props.state.users;
    const delta_t = props.state.delta_t;
    document.getElementById('tick').innerHTML = delta_t;
    props.setState({delta_t: delta_t + 1});
    users.map((user, index) => {
        if (user.pomodoro_state !== PomodoroState.STOPPED) {
            const rel_time = get_rel_time();

            // first check if we have to go to a new state
            checkState({user: user, rel_time: rel_time});

            // generate the progress bar from users pomodore states
            const pbar_id = "progress_" + user.id;
            document.getElementById(pbar_id).innerHTML = progressBar({
                rel_time: rel_time,
                pomodoros: user.pomodoros,
                pomodoro_state: user.pomodoro_state
            });
        }
    });
};



const start = (users) => {
    console.log("Start!");

    users.map((user, index) => {
        // Only do this if items have no stable IDs

        const start_pomodoro = user.pomodoro_state === PomodoroState.STOPPED;
        console.log(user.pomodoro_state + " == " + PomodoroState.STOPPED + " : " + start_pomodoro);

        if (start_pomodoro) {
            console.log('start');
            toggle_pomodoro_state(user);

            console.log("user: " + user.name + ", pomodoro: " + user.pomodoro_state);
            user.pomodoro_start = get_rel_time();

        } else {
            console.log('stop');
            toggle_pomodoro_state(user);
            user.pomodoros.push(user.pomodoro_start);
            user.pomodoros.push(get_rel_time());

        }
    });
    //$("#info").textdocument.getElementById("control").innerText = (pomodoro_state)
    return false;
};
