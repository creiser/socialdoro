/**
 * Created by tvaisanen on 11/17/17.
 */
import React, {Component} from 'react';

import { Line, Circle } from 'rc-progress';
import { PomodoroState, get_rel_time, pomodoro_time, break_time, getUserProgressInPercent } from '../Util';
import { Button } from 'react-bootstrap';

class PomodoroPersonal extends Component {
    render() {
		var stroke_color = this.props.users[this.props.user_id].pomodoro_state == PomodoroState.POMODORO ? 'red' : 'green';
		var width = getUserProgressInPercent(this.props.users[this.props.user_id]);
		
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
            <div className="pomodoro_personal">
				Current user: {this.props.user_id}
				<Circle percent={width} strokeWidth="4" trailWidth="4" strokeColor={stroke_color} />
				<Button onClick={this.props.onControlClick} bsStyle="primary">{control_button_text}</Button>
                <div>{info_text}</div>
            </div>
        );
    }
}

export default PomodoroPersonal;