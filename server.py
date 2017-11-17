from flask import Flask, jsonify, render_template, request
from enum import Enum
import time
app = Flask(__name__, static_url_path='')

POMODOROSTATE_OFFLINE = 0
POMODOROSTATE_STOPPED = 1
POMODOROSTATE_POMODORO = 2
POMODOROSTATE_BREAK = 3

debug_start = time.time() # seconds since 1970
num_users = 4
users = [{'pomodoro_state' : POMODOROSTATE_OFFLINE,
          'pomodoro_start' : None,
          'last_update' : 0,
          'pomodoros' : []} for _ in range(num_users)] # [start, end, start, end, ..]

@app.route('/react_src')
def root():
    """ Serve the static index.html """
    return app.send_static_file('index.html')

def check_for_timeouts():
    # TODO: in case of timeout we could nevertheless add pomodoro
    for i in range(num_users):
        if time.time() - users[i]['last_update'] > 2:
            users[i]['pomodoro_state'] = POMODOROSTATE_OFFLINE

@app.route('/_user_status')
def user_status():
    try:

        user_id = request.args.get('user_id', type=int)
        if not isinstance(user_id, int):
            raise ValueError('arg: user_id is wrong type. Expected int.')

        users[user_id]['pomodoro_state'] = request.args.get('pomodoro_state', 0, type=int)
        if not isinstance(users[user_id]['pomodoro_state'], int):
            raise ValueError('arg: pomodoro_state is wrong type. Expected int.')

        users[user_id]['pomodoro_start'] = request.args.get('pomodoro_start', 0, type=float)
        if not isinstance(users[user_id]['pomodoro_state'], float):
            raise ValueError('arg: pomodoro_state is wrong type. Expected float.')

        users[user_id]['last_update'] = time.time()

        # Convert comma seperated string into float array
        # Make sure to not overwrite pomodoros saved on server
        # with empty pomodoro array that we get on first call
        retrieved_pomodoros = request.args.get('pomodoros', '', type=str)
        if retrieved_pomodoros:
            users[user_id]['pomodoros'] = [float(x) for x in retrieved_pomodoros.split(',')]

        print(users[user_id]['pomodoros'])

        check_for_timeouts() # TODO: put this check somewhere else, just a hack
    except Exception as e:
        error_response = {'error_msg': str(e)}
        return jsonify(error=error_response)

    return jsonify(users=users)

@app.route('/_add_pomodoro')
def add_pomodoro():
    user_id = request.args.get('user_id', type=int)
    pomodoro_start = request.args.get('start', type=float)
    pomodoro_end = request.args.get('end', type=float)
    users[user_id]['pomodoros'].append(pomodoro_start)
    users[user_id]['pomodoros'].append(pomodoro_end)
    #pomodoros[user_id].append(pomodoro_start)
    #pomodoros[user_id].append(pomodoro_end)
    #print(pomodoros)
    return jsonify(result="")

@app.route('/')
def index():
    user_id = request.args.get('user_id', 0, type=int)
    return render_template('index.html',
                           user_id=user_id,
                           num_users=num_users,
                           debug_start=debug_start,
                           #pomodoros=pomodoros
                           )

@app.route('/app')
def app_route():
    print(app.static_url_path)
    return render_template('app.html')


if __name__ == '__main__':
    app.run(host = '0.0.0.0')
