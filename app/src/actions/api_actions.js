/**
 * Created by tvaisanen on 11/15/17.
 */


const get_user_pomodor = () => {

};

const ROOT = 'http://localhost:3000'

export const get_user_status = (user) => {

    console.group("api_actions.get_user_status(user)")
    console.info("user: ");
    console.info(user);
    console.groupEnd();

    const user_id = 1; // DEBUGGING

    try {
        // Convert list to string of comma seperated values for GET request
        // TODO: more elegant by just sending everything as a single JSON object
        var pomodoros_string = "";

        try {
            for (let i = 0; i < user.pomodoros.length; i++) {
                pomodoros_string += user.pomodoros[i];
                if (i !== user.pomodoros.length - 1)
                    pomodoros_string += ",";
            }
        } catch (e) {
            console.warn("api_actions.get_user_state() :: ERROR with pomodoro_string");
        }

        const promise = fetch(ROOT + '/_user_status', {
            user_id: user_id,
            pomodoro_state: user.pomodoro_state,
            pomodoro_start: user.pomodoro_start,
            pomodoros: pomodoros_string
        });

        promise.then(function (response) {
            // Copy everything except state of logged in user, because we have
            // locally more recent state of logged in user.
            const json = response.json();
            console.debug(json);
            return json;
        }).then((json) => {

            // this stores the received values to local variables?
            /*
            for (let i = 0; i < num_users; i++) {
             if (i !== user_id) {
             users[i] = data.users[i];
             }

             // Debug output pomodoros retrieved from server:
             console.log(user.pomodoros);
             }
*/
            // At the beginning retrieve pomodoros from server after
            // that we are again in possession of more recent info.

            let got_first_update = false;

            if (!got_first_update) {
                user.pomodoros = json.user.pomodoros;
                got_first_update = true;
            }
        });

    } catch (e) {
        console.group("api_actions.get_user_state(): ERROR");
        console.error(e);
        console.groupEnd();
        return e;
    }
};