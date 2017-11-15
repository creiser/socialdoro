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

            </th>
            <th>Name</th>
            <th>Active Pomodoro</th>
            <th>Today's progress</th>
        </tr>
        </thead>
        <tbody>
        {users.map((user) =>
            <tr>
                <td ><Glyphicon id="control" glyph="play-circle" onClick={() => checkState({user:user})}/>
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
        }
        this.tick_clock = this.tick_clock.bind(this);
    }

    tick_clock(){
        const incr_time = this.state.counter + 1;
        console.log(incr_time);
        this.setState({ counter: incr_time })
    }

    componentDidMount() {
        start(this.state.users, this);
        let timer = setInterval(this.tick_clock, 1000);
        this.setState({timer});
        /*let delta_t = setInterval(tick(this.state.users), 10);
        let clock = setInterval(() => {
            console.log(timer);

            document.getElementById('timer').innerHTML = timer;
        }, 1000);*/

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

const progressBar = (props) => {
    /*
    return: div element with progress_bar
     */
    let progress_html = "";
    for (let i = 0; i < props.pomodoros.length; i += 2) {
        let width = props.pomodoros[i + 1] - props.pomodoros[i]; // 1% = 1 second
        progress_html += '<div style="width: ' + width + '%; height: 21px; background-color: green; float: left;"></div>';
        if (i + 2 < props.pomodoros.length) {
            width = props.pomodoros[i + 2] - props.pomodoros[i + 1];
            progress_html += '<div style="width: ' + width + '%; height: 21px; float: left;"></div>';
        }
    }

    // current active pomodoro will be updated continously
    if (props.pomodoro_state === PomodoroState.POMODORO) {
        if (props.pomodoros.length) {
            let width = props.pomodoro_start - props.pomodoros[props.pomodoros.length - 1];
            progress_html += '<div style="width: ' + width + '%; height: 21px; float: left;"></div>';
        }

        let width = props.rel_time - props.pomodoro_start;
        progress_html += '<div style="width: ' + width + '%; height: 21px; background-color: green; float: left;"></div>';
    }
    return progress_html;
};

const checkState = (props) => {
    console.log("checkState("+props.user.name+")");
    console.log(props.user);
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

    /*
    console.log('working: ' + user.pomodoro_state + ' === ' + PomodoroState.POMODORO + " = " + working);
    console.log('rel_time_gt: ' + rel_time + ' > ' + user.pomodoro_start + POMODORO_TIME + ' = ' + rel_time_gt);
    console.log('set break = ' + set_state_break);
    console.log('on_break = ' + on_break);
    console.log('break over = ' + break_over);
    console.log('set work = ' + set_state_work);
    */

    if (set_state_break) {
        console.log("Set state to BREAK");
        user.pomodoro_state = PomodoroState.BREAK;
        add_pomodoro_to_user(user);
    } else if (set_state_work) {
        console.log("Set state to POMODORO");
        user.pomodoro_state = PomodoroState.POMODORO;
        user.pomodoro_start = user.pomodoro_start + POMODORO_TIME + BREAK_TIME;
    }
};

const tick = (users) => {
    console.log("tick: " + document.getElementById('timer').innerHTML);
    document.getElementById('tick').innerHTML = document.getElementById('timer').innerHTML;
    users.map((user, index) => {
        if (user.pomodoro_state !== PomodoroState.STOPPED) {
            const rel_time = get_rel_time();

            // first check if we have to go to a new state
            checkState({user: user, rel_time: rel_time});

            // generate the progress bar from users pomodore states
            const pbar_id = "progress_" + user.id;
            document.getElementById(pbar_id)
                .innerHTML = progressBar({
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
            user.pomodoro_state = PomodoroState.POMODORO;
            console.log("user: " + user.name + ", pomodoro: " + user.pomodoro_state);
            user.pomodoro_start = get_rel_time();

        } else {
            console.log('stop');
            user.pomodoro_state = PomodoroState.STOPPED;
            user.pomodoros.push(user.pomodoro_start);
            user.pomodoros.push(get_rel_time());

        }
    });
    //$("#info").textdocument.getElementById("control").innerText = (pomodoro_state)
    return false;
};
