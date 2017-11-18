/**
 * Created by tvaisanen on 11/17/17.
 */
import React, {Component} from 'react';

import { Line, Circle } from 'rc-progress';
import { PomodoroState, get_rel_time, pomodoro_time, break_time, getUserProgressInPercent } from '../Util';
import '../css/pomodoro_live.css';

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

class PomodoroLive extends Component {
    render() {
		if (!this.props.users)
			return <div></div>;
		
		// HACK: convert dict to array for rendering
		var user_array = [];
		for (var user_id in this.props.users) {
			if (this.props.users.hasOwnProperty(user_id)) {
				var user = this.props.users[user_id];
				user.user_id = user_id;
				user_array.push(this.props.users[user_id]);
			}
		}
		
        const rows = user_array.map((user, i) => {
			var stroke_color = user.pomodoro_state == PomodoroState.POMODORO ? 'red' : 'green';
            var width = getUserProgressInPercent(user);

            // Display the sync button for all OTHER users that are either in pomodoro or in break.
            var sync_button_display =
                (user.pomodoro_state == PomodoroState.POMODORO ||
                user.pomodoro_state == PomodoroState.BREAK) &&
                user.user_id != this.props.user_id ? 'inline' : 'none';
				
			// TODO: We could pack this into a function.
			var total_pomodoro_time = 0;
			for (var j = 0; j < user.pomodoros.length; j += 2) {
				total_pomodoro_time += user.pomodoros[j + 1] - user.pomodoros[j];
			}
			
			// Add time of not yet finished pomodoro
			if (user.pomodoro_state == PomodoroState.POMODORO) {
				total_pomodoro_time += get_rel_time() - user.real_pomodoro_start;
			}

            return (
                <div>
                    <div>User {user.user_id}: {pomodoro_state_to_string(user.pomodoro_state)}</div>
					<Line percent={width} strokeWidth="4" trailWidth="4" strokeColor={stroke_color} />
                    <button onClick={() => this.props.onSyncClick(user.user_id)}
                            style={ {marginLeft: '10px', float: 'left', display: sync_button_display} }>Sync
                    </button>
                    <div style={ {clear: 'both'} }>Total time: {Math.round(total_pomodoro_time)}</div>
                </div>
            );
        });

        return (
            <div className="pomodoro_live">
                {rows}
            </div>
        );
    }
}

export default PomodoroLive;