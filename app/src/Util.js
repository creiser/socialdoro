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