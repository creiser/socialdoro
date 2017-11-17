/**
 * Created by tvaisanen on 11/17/17.
 */

export const PomodoroState = {
    STOPPED: 'STOPPED',
    POMODORO: 'POMODORO',
    BREAK: 'BREAK'
};

export const toggle_pomodoro_state = (user) => {
    if (user.pomodoro_state === PomodoroState.POMODORO) {
        user.pomodoro_state = PomodoroState.STOPPED;
    } else {
        user.pomodoro_state = PomodoroState.POMODORO;
    }
};

export const progress_bar_block = (props) => {
    return '<div style="width: ' + props.width + '%; height: 21px; background-color:' + props.bgcolor + '; float: left;"></div>';
};

export const progressBar = (props) => {
    /*
     return: div element with progress_bar
     */

    let progress_html = "";
    /*
     for (let i = 0; i < props.pomodoros.length; i += 2) {
     let width = props.pomodoros[i + 1] - props.pomodoros[i]; // 1% = 1 second
     progress_html += progress_bar_block({width: width, bgcolor: "green"});
     if (i + 2 < props.pomodoros.length) {
     width = props.pomodoros[i + 2] - props.pomodoros[i + 1];
     progress_html += progress_bar_block({width: width, bgcolor: "red"});
     }
     }*/

    // current active pomodoro will be updated continously
    /*if (props.pomodoro_state === PomodoroState.POMODORO) {

     if (props.pomodoros.length) {
     let width = props.pomodoro_start - props.pomodoros[props.pomodoros.length - 1];
     progress_html += progress_bar_block({width: width, bgcolor: "red"});
     }

     let width = props.rel_time - props.pomodoro_start;
     progress_html += progress_bar_block({width: width, bgcolor: "green"});
     }*/
    return progress_html;
};
