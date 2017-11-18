/**
 * Created by tvaisanen on 11/17/17.
 */
import React, {Component} from 'react';
import { Line, Circle } from 'rc-progress';
import { PomodoroState, get_rel_time, pomodoro_time, break_time } from '../Util';

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
        const rows = this.props.users.map((user, i) => {
            var width = 0;
			var stroke_color = 'green';

            if (user.pomodoro_state == PomodoroState.POMODORO) {
                width = (get_rel_time() - user.pomodoro_start) * 100 / pomodoro_time;
				stroke_color = 'red';
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
                i != this.props.user_id ? 'inline' : 'none';
				
			
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
                    <div>User {i}: {pomodoro_state_to_string(user.pomodoro_state)}</div>
					<Line percent={width} strokeWidth="4" trailWidth="4" strokeColor={stroke_color} />
                    <button onClick={() => this.props.onSyncClick(i)}
                            style={ {marginLeft: '10px', float: 'left', display: sync_button_display} }>Sync
                    </button>
                    <div style={ {clear: 'both'} }>Total time: {Math.round(total_pomodoro_time)}</div>
                </div>
            );
        });

        // Current user specific
        var info_text = 'Press start to start pomodoro';

        var current_user = this.props.users[this.props.user_id];
        if (current_user.pomodoro_state == PomodoroState.POMODORO) {
            info_text = "Work! Next break in " + Math.round(current_user.pomodoro_start + pomodoro_time - get_rel_time()) + " seconds.";
        } else if (current_user.pomodoro_state == PomodoroState.BREAK) {
            info_text = "Take a break! Next pomodoro in " + Math.round(current_user.pomodoro_start + pomodoro_time + break_time - get_rel_time()) + " seconds.";
        }

        var control_button_text = current_user.pomodoro_state == PomodoroState.POMODORO ||
        current_user.pomodoro_state == PomodoroState.BREAK ? 'Stop' : 'Start';

        return (
            <div style={ {maxWidth: '300px'} }>
                Current user: {this.props.user_id}
                {rows}
                <button onClick={this.props.onControlClick}
                        style={ {margin: '10px'} }>{control_button_text}</button>
                <div>{info_text}</div>
            </div>
        );
    }
}

export default PomodoroLive;