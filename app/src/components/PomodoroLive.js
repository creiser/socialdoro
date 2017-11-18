/**
 * Created by tvaisanen on 11/17/17.
 */
import $ from 'jquery';
import React, {Component} from 'react';
import { Line, Circle } from 'rc-progress';

// For testing purposes, 100 seconds = 1 day
var PomodoroState = {
    OFFLINE: 0,
    STOPPED: 1,
    POMODORO: 2,
    BREAK: 3,
};

function pomodoro_state_to_string(pomodoro_state) {
    var string;
    switch (pomodoro_state) {
        case PomodoroState.OFFLINE:
            string = "offline";
            break;
        case PomodoroState.STOPPED:
            string = "stopped";
            break;
        case PomodoroState.POMODORO:
            string = "pomodoro";
            break;
        case PomodoroState.BREAK:
            string = "break";
            break;
    }
    return string;
}

// Returns time since 1970 in seconds (equivalent to Python: time.time())
function get_rel_time() {
    //return new Date().getTime() / 1000 - debug_start;
    return new Date().getTime() / 1000;
}

var pomodoro_time = 10; // in seconds
var break_time = 4; // in seconds


class PomodoroLive extends Component {
    constructor(props) {
        super(props);
        const user_id = 1;
        let num_users = 4;
        let users = new Array(4);


        // Initialize friends to default values.
        for (let i = 0; i < num_users; i++) {
            users[i] = {};
            users[i].pomodoro_state = PomodoroState.OFFLINE;
            users[i].pomodoro_start = 0;
            users[i].pomodoros = [];
        }
        users[user_id].pomodoro_state = PomodoroState.STOPPED;

        this.state = {
            user_id: user_id,
            num_users: num_users,
            users: users
        };

        this.got_first_update = false;
        this.real_pomodoro_start = null;
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            100
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        const rows = this.state.users.map((user, i) => {
            var width = 0;

            if (user.pomodoro_state == PomodoroState.POMODORO) {
                width = (get_rel_time() - user.pomodoro_start) * 100 / pomodoro_time;
            } else if (user.pomodoro_state == PomodoroState.BREAK) {
                width = (get_rel_time() - (user.pomodoro_start + pomodoro_time)) * 100 / break_time;
            }
            // Instead of performing predictive state changes for all users, we just define that maximum here!!
            // This is simple and more robust!
            width = Math.min(100, width);

            // Display the sync button for all OTHER users that are either in pomodoro or in break.
            var sync_button_display =
                (user.pomodoro_state == PomodoroState.POMODORO ||
                user.pomodoro_state == PomodoroState.BREAK) &&
                i != this.state.user_id ? 'inline' : 'none';
				
			
			// TODO: We could pack this into a function.
			var total_pomodoro_time = 0;
			for (var j = 0; j < user.pomodoros.length; j += 2) {
				total_pomodoro_time += user.pomodoros[j + 1] - user.pomodoros[j];
			}
			
			// Add time of not yet finished pomodoro
			if (user.pomodoro_state == PomodoroState.POMODORO) {
				total_pomodoro_time += get_rel_time() - this.real_pomodoro_start;
			}

            return (
                <div>
                    <div>User {i}: {pomodoro_state_to_string(user.pomodoro_state)}</div>
					<Line percent={width} strokeWidth="4" trailWidth="4" strokeColor="green" />
                    <button onClick={() => this.onSyncClicked(this, i)}
                            style={ {marginLeft: '10px', float: 'left', display: sync_button_display} }>Sync
                    </button>
                    <div style={ {clear: 'both'} }>Total time: {Math.round(total_pomodoro_time)}</div>
                </div>
            );
        });

        // Current user specific
        var info_text = 'Press start to start pomodoro';

        var current_user = this.state.users[this.state.user_id];
        if (current_user.pomodoro_state == PomodoroState.POMODORO) {
            info_text = "Work! Next break in " + Math.round(current_user.pomodoro_start + pomodoro_time - get_rel_time()) + " seconds.";
        } else if (current_user.pomodoro_state == PomodoroState.BREAK) {
            info_text = "Take a break! Next pomodoro in " + Math.round(current_user.pomodoro_start + pomodoro_time + break_time - get_rel_time()) + " seconds.";
        }

        var control_button_text = current_user.pomodoro_state == PomodoroState.POMODORO ||
        current_user.pomodoro_state == PomodoroState.BREAK ? 'Stop' : 'Start';

        return (
            <div style={ {maxWidth: '300px'} }>
                Current user: {this.state.user_id}
                {rows}
                <button onClick={() => this.onControlClicked(this)}
                        style={ {margin: '10px'} }>{control_button_text}</button>
                <div>{info_text}</div>
            </div>
        );
    }

    user_status() {
        var current_user = this.state.users[this.state.user_id];

        // Convert list to string of comma seperated values for GET request
        // TODO: more elegant by just sending everything as a single JSON object
        var pomodoros_string = "";
        for (var i = 0; i < current_user.pomodoros.length; i++) {
            pomodoros_string += current_user.pomodoros[i];
            if (i != current_user.pomodoros.length - 1)
                pomodoros_string += ",";
        }

        var pass_this = this;

        $.getJSON('http://127.0.0.1:5000/_user_status', {
            user_id: this.state.user_id,
            pomodoro_state: current_user.pomodoro_state,
            pomodoro_start: current_user.pomodoro_start,
            pomodoros: pomodoros_string
        }, function (data) {
            var users = pass_this.state.users.slice(); // Important to work on copy with React!

            // Copy everything except state of logged in user, because we have
            // locally more recent state of logged in user.
            for (var i = 0; i < pass_this.state.num_users; i++) {
                if (i != pass_this.state.user_id) {
                    users[i] = data.users[i];
                }

                // TODO: this is probably automatic now.
                // Debug output pomodoros retrieved from server:
                //$("#pomodoros_" + i).text(users[i].pomodoros);
            }

            // At the beginning retrieve pomodoros from server after
            // that we are again in possession of more recent info.
            if (!pass_this.got_first_update) {
                users[pass_this.state.user_id].pomodoros = data.users[pass_this.state.user_id].pomodoros;
                pass_this.got_fist_update = true;
            }

            // Push changes to React.
            pass_this.setState({users: users});


        });

    }

    add_pomodoro() {
        var users = this.state.users.slice();
        users[this.state.user_id].pomodoros.push(this.real_pomodoro_start);
        users[this.state.user_id].pomodoros.push(get_rel_time());
        this.setState({users: users});
        console.log(this.state.users);
    }

    tick() {
        var users = this.state.users.slice();

        // we go from pomodoro to break and vice versa for all users in friends list
        // by that if we receive for a longer time no update from a friend we still
        // can display a guess for his current state
        for (var i = 0; i < users.length; i++) {

            // TODO: remove loop and just update current user, prediction of other users is not nessecary anymore!
            if (i != this.state.user_id)
                continue;

            if (users[i].pomodoro_state == PomodoroState.POMODORO || users[i].pomodoro_state == PomodoroState.BREAK) {
                // first check if we have to go to a new state
                if (users[i].pomodoro_state == PomodoroState.POMODORO && get_rel_time() > users[i].pomodoro_start + pomodoro_time) {
                    users[i].pomodoro_state = PomodoroState.BREAK;
                    if (i == this.state.user_id) {
                        this.add_pomodoro();
                    }
                } else if (users[i].pomodoro_state == PomodoroState.BREAK && get_rel_time() > users[i].pomodoro_start + pomodoro_time + break_time) {
                    users[i].pomodoro_state = PomodoroState.POMODORO;
                    this.real_pomodoro_start = users[i].pomodoro_start = users[i].pomodoro_start + pomodoro_time + break_time;
                }
            }
        }

        this.setState({users: users});

        // send currents user status and retrieve friends statuses
        this.user_status();
    }

    onControlClicked(pass_this) {
        var users = pass_this.state.users.slice();

        if (users[pass_this.state.user_id].pomodoro_state == PomodoroState.STOPPED) {
            users[pass_this.state.user_id].pomodoro_state = PomodoroState.POMODORO;
            pass_this.real_pomodoro_start = users[pass_this.state.user_id].pomodoro_start = get_rel_time();
        } else /* if (pomodoro_state == PomodoroState.POMODORO || pomodoro_state == PomodoroState.BREAK) */ {
            users[pass_this.state.user_id].pomodoro_state = PomodoroState.STOPPED;
            pass_this.add_pomodoro();
        }

        pass_this.setState({users: users});
    }

    onSyncClicked(pass_this, partner_id) {
        var users = pass_this.state.users.slice();

        // If we are right now in a pomodoro, save it as a seperate unit.
        if (users[pass_this.state.user_id].pomodoro_state == PomodoroState.POMODORO) {
            pass_this.add_pomodoro();
        }

        // Here is why we introduced real_pomodoro_start, because in this
        // scenario pomodoro_start and real_pomodoro_start diverge.
        pass_this.real_pomodoro_start = get_rel_time();
        users[pass_this.state.user_id].pomodoro_start = users[partner_id].pomodoro_start;
        users[pass_this.state.user_id].pomodoro_state = users[partner_id].pomodoro_state;

        pass_this.setState({users: users});
    }
}

export default PomodoroLive;