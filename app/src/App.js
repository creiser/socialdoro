import React, {Component} from 'react';
import './App.css';

import PomodoroLive from './components/PomodoroLive';
import PomodoroOverview from './components/PomodoroOverview';
import PomodoroNavbar from './components/PomodoroNavbar';
import $ from 'jquery';
import { PomodoroState, get_rel_time, pomodoro_time, break_time, getUrlParameter } from './Util';

class App extends Component {
    constructor(props) {
        super(props);
        const user_id = getUrlParameter('user_id') ? getUrlParameter('user_id') : 0;
        const num_users = 4;
        let users = new Array(num_users);

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

    handleControlClick() {
        var users = this.state.users.slice();

        if (users[this.state.user_id].pomodoro_state == PomodoroState.STOPPED) {
            users[this.state.user_id].pomodoro_state = PomodoroState.POMODORO;
            this.real_pomodoro_start = users[this.state.user_id].pomodoro_start = get_rel_time();
        } else /* if (pomodoro_state == PomodoroState.POMODORO || pomodoro_state == PomodoroState.BREAK) */ {
            users[this.state.user_id].pomodoro_state = PomodoroState.STOPPED;
            this.add_pomodoro();
        }

        this.setState({users: users});
    }

    handleSyncClick(partner_id) {
        var users = this.state.users.slice();

        // If we are right now in a pomodoro, save it as a seperate unit.
        if (users[this.state.user_id].pomodoro_state == PomodoroState.POMODORO) {
            this.add_pomodoro();
        }

        // Here is why we introduced real_pomodoro_start, because in this
        // scenario pomodoro_start and real_pomodoro_start diverge.
        this.real_pomodoro_start = get_rel_time();
        users[this.state.user_id].pomodoro_start = users[partner_id].pomodoro_start;
        users[this.state.user_id].pomodoro_state = users[partner_id].pomodoro_state;

        this.setState({users: users});
    }

    render() {
        return (
			<div className="App">
				<PomodoroNavbar />
				<PomodoroLive
					user_id={this.state.user_id}
					users={this.state.users}
					onControlClick={() => this.handleControlClick()}
					onSyncClick={(partner_id) => this.handleSyncClick(partner_id)}
					real_pomodoro_start={this.real_pomodoro_start} />
				<PomodoroOverview />´
			</div>
        );
    }
}

export default App;


