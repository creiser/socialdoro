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
        for (let i = 0; i < users.length; i++) {
            users[i] = {};
            users[i].pomodoro_state = PomodoroState.OFFLINE;
            users[i].pomodoro_start = 0;
			users[i].real_pomodoro_start = 0;
            users[i].pomodoros = [];
        }
        users[user_id].pomodoro_state = PomodoroState.STOPPED;

        this.state = {
            user_id: user_id,
            users: users
        };
		

        this.got_first_update = false;
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
			real_pomodoro_start: current_user.real_pomodoro_start,
            pomodoros: pomodoros_string
        }, function (data) {
            var users = pass_this.state.users.slice(); // Important to work on copy with React!

            // Copy everything except state of logged in user, because we have
            // locally more recent state of logged in user.
            for (var i = 0; i < pass_this.state.users.length; i++) {
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
        users[this.state.user_id].pomodoros.push(this.state.users[this.state.user_id].real_pomodoro_start);
        users[this.state.user_id].pomodoros.push(get_rel_time());
        this.setState({users: users});
        console.log(this.state.users);
    }

    tick() {
        var users = this.state.users.slice();
		var current_user = users[this.state.user_id];

        // We go from pomodoro to break and vice versa, if the pomodoro respective break time is over
		if (current_user.pomodoro_state == PomodoroState.POMODORO || current_user.pomodoro_state == PomodoroState.BREAK) {
			// first check if we have to go to a new state
			if (current_user.pomodoro_state == PomodoroState.POMODORO && get_rel_time() > current_user.pomodoro_start + pomodoro_time) {
				current_user.pomodoro_state = PomodoroState.BREAK;
				this.add_pomodoro();
			} else if (current_user.pomodoro_state == PomodoroState.BREAK && get_rel_time() > current_user.pomodoro_start + pomodoro_time + break_time) {
				current_user.pomodoro_state = PomodoroState.POMODORO;
				users[this.state.user_id].real_pomodoro_start = current_user.pomodoro_start = current_user.pomodoro_start + pomodoro_time + break_time;
			}
		}

		users[this.state.user_id] = current_user;
        this.setState({users: users});

        // send currents user status and retrieve friends statuses
        this.user_status();
    }

    handleControlClick() {
        var users = this.state.users.slice();

        if (users[this.state.user_id].pomodoro_state == PomodoroState.STOPPED) {
            users[this.state.user_id].pomodoro_state = PomodoroState.POMODORO;
            users[this.state.user_id].real_pomodoro_start = users[this.state.user_id].pomodoro_start = get_rel_time();
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
        users[this.state.user_id].real_pomodoro_start = get_rel_time();
        users[this.state.user_id].pomodoro_start = users[partner_id].pomodoro_start;
        users[this.state.user_id].pomodoro_state = users[partner_id].pomodoro_state;

        this.setState({users: users});
    }

    render() {
        return (
			<div className="social_pomodoro">
				<PomodoroNavbar />
				<PomodoroLive
					user_id={this.state.user_id}
					users={this.state.users}
					onControlClick={() => this.handleControlClick()}
					onSyncClick={(partner_id) => this.handleSyncClick(partner_id)} />
				<PomodoroOverview />´
			</div>
        );
    }
}

export default App;


