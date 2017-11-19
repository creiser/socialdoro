// For testing purposes, 100 seconds = 1 day
export var PomodoroState = {
    OFFLINE: 0,
    STOPPED: 1,
    POMODORO: 2,
    BREAK: 3,
};

// Returns time since 1970 in seconds (equivalent to Python: time.time())
export function get_rel_time() {
    //return new Date().getTime() / 1000 - debug_start;
    return new Date().getTime() / 1000;
}

export const pomodoro_time = 10; // in seconds
export const break_time = 4; // in seconds


export function getUserProgressInPercent(user) {
	var width = 0;		
	if (user.pomodoro_state == PomodoroState.POMODORO) {
		width = (get_rel_time() - user.pomodoro_start) * 100 / pomodoro_time;
	} else if (user.pomodoro_state == PomodoroState.BREAK) {
		width = (get_rel_time() - (user.pomodoro_start + pomodoro_time)) * 100 / break_time;
	}
	// Instead of performing predictive state changes for all users, we just define that maximum here!!
	// This is simple and more robust!
	width = Math.min(100, width);
	return width;
}

// This is just for my beloved debugging method
export var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

// really bad programmed :D
export function prettyTime(seconds) {
	var seconds = Math.round(seconds);
	return Math.floor(seconds / 60) + ':' + (seconds % 60 < 10 ? '0' : '') + seconds % 60;
}
