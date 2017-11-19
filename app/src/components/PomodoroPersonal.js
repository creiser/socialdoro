/**
 * Created by tvaisanen on 11/17/17.
 */
import React, {Component} from 'react';

import { Line, Circle } from 'rc-progress';
import { PomodoroState, get_rel_time, pomodoro_time, break_time, getUserProgressInPercent, prettyTime } from '../Util';
import { Button } from 'react-bootstrap';
import $ from 'jquery';

class PomodoroPersonal extends Component {
    render() {
		if (!this.props.users)
			return <div></div>;
		
		var stroke_color = this.props.users[this.props.user_id].pomodoro_state == PomodoroState.POMODORO ? 'red' : 'green';
		var width = getUserProgressInPercent(this.props.users[this.props.user_id]);
		
		// Current user specific
       //var info_text = 'Press start to start pomodoro';
		var info_text = '';
		var remaining_time = '';
		var color = 'green';

        var current_user = this.props.users[this.props.user_id];
        if (current_user.pomodoro_state == PomodoroState.POMODORO) {
            //info_text = "Work! Next break in " + Math.round(current_user.pomodoro_start + pomodoro_time - get_rel_time()) + " seconds.";
			info_text = 'Work';
			remaining_time = prettyTime(current_user.pomodoro_start + pomodoro_time - get_rel_time());
			color = 'red';
        } else if (current_user.pomodoro_state == PomodoroState.BREAK) {
            //info_text = "Take a break! Next pomodoro in " + Math.round(current_user.pomodoro_start + pomodoro_time + break_time - get_rel_time()) + " seconds.";
			remaining_time = prettyTime(current_user.pomodoro_start + pomodoro_time + break_time - get_rel_time());
			info_text = 'Break';
        }

        var control_button_text = current_user.pomodoro_state == PomodoroState.POMODORO ||
        current_user.pomodoro_state == PomodoroState.BREAK ? 'Stop' : 'Start';
		
		
		// candidate for hacking hall of fame
		$('#rem_t').html('<svg viewBox="0 0 100 100"><text x="50%" y="40%" fill="' + color + '" text-anchor="middle" alignment-baseline="central" font-size="13">' + info_text + '</text>' + 
		'<text x="50%" y="60%" fill="' + color + '" text-anchor="middle" alignment-baseline="central" font-size="13">' + remaining_time + '</text></svg>');
		var offset = $('.rc-progress-circle').outerHeight();
		
        return (
            <div className="pomodoro_personal" style={{textAlign: 'center'}}>
				<Circle percent={width} strokeWidth="4" trailWidth="4" strokeColor={stroke_color} />
				<div id="rem_t" style={{marginBottom: -offset, position: 'relative', bottom: offset}}>
				</div>
				<Button onClick={this.props.onControlClick} bsStyle="primary">{control_button_text}</Button>
            </div>
        );
    }
	
	componentDidMount() {
		$('#personalCountdown').remove();
		$('.rc-progress-circle').html($('.rc-progress-circle').html() + '<text id="personalCountdown" x="50%" y="50%" fill="black" text-anchor="middle" alignment-baseline="central" font-size="10">what the fork</text>');
	}
}

export default PomodoroPersonal;