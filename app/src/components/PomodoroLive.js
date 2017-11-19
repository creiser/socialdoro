/**
 * Created by tvaisanen on 11/17/17.
 */
import React, {Component} from 'react';

import { Line, Circle } from 'rc-progress';
import { PomodoroState, get_rel_time, pomodoro_time, break_time, getUserProgressInPercent, prettyTime} from '../Util';
import '../css/pomodoro_live.css';
import { Button } from 'react-bootstrap';

function pomodoro_state_to_string(pomodoro_state) {
    var string;
    switch (pomodoro_state) {
        case PomodoroState.OFFLINE:
            string = "Offline";
            break;
        case PomodoroState.STOPPED:
            string = "Online";
            break;
        case PomodoroState.POMODORO:
            string = "Pomodoro";
            break;
        case PomodoroState.BREAK:
            string = "Break";
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
			
			
			// !!! The following code is not a state change, but merely predicts the real state of other users !!!
			// We go from pomodoro to break and vice versa, if the pomodoro respective break time is over
			if (user.pomodoro_state == PomodoroState.POMODORO || user.pomodoro_state == PomodoroState.BREAK) {
				// first check if we have to go to a new state
				if (user.pomodoro_state == PomodoroState.POMODORO && get_rel_time() > user.pomodoro_start + pomodoro_time) {
					user.pomodoro_state = PomodoroState.BREAK;
				} else if (user.pomodoro_state == PomodoroState.BREAK && get_rel_time() > user.pomodoro_start + pomodoro_time + break_time) {
					user.pomodoro_state = PomodoroState.POMODORO;
					user.real_pomodoro_start = user.pomodoro_start = user.pomodoro_start + pomodoro_time + break_time;
				}
			}
			// !!! The changes are not commited !!!

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
			
			var first_name = user.name.split(' ')[0];

            return (
                <div>
					<div style={{marginBottom: '5px', float: 'left'}}>
						<img width="40" height="40" src={user.picture} style={{verticalAlign: 'middle', borderRadius: "25px", marginRight: '10px'}}/>
						<span style={{verticalAlign: 'middle', fontSize: '20px'}}>{user.name}: {pomodoro_state_to_string(user.pomodoro_state)}</span>
					</div>
					
					<div style={{height: '40px', lineHeight: '40px', marginBottom: '5px', float: 'right'}}>
						<span style={{verticalAlign: 'middle', fontSize: '20px'}}>Today's total time: {prettyTime(total_pomodoro_time)}</span>
					</div>
					
					<div style={ {clear: 'both'} }></div>
			
					<Line percent={width} strokeWidth="4" trailWidth="4" strokeColor={stroke_color} />
                    <button onClick={() => this.props.onSyncClick(user.user_id)}
                            style={ {marginLeft: '10px', float: 'left', display: 'none'} }>Sync
                    </button>
					
					<Button style={ {float: 'right', display: sync_button_display} }
						oonClick={() => this.props.onSyncClick(user.user_id)} bsStyle="primary">Sync with {first_name}</Button>
					
                    <div style={ {clear: 'both', marginBottom: "20px"} }></div>
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