from flask import Flask, jsonify, render_template, request
from enum import Enum
import time
import os
from flask_cors import CORS, cross_origin
app = Flask(__name__, static_url_path='/../app/src')
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


POMODOROSTATE_OFFLINE = 0
POMODOROSTATE_STOPPED = 1
POMODOROSTATE_POMODORO = 2
POMODOROSTATE_BREAK = 3

debug_start = time.time() # seconds since 1970
#users = [{'pomodoro_state' : POMODOROSTATE_OFFLINE,
#          'pomodoro_start' : None,
#          'last_update' : 0,
#          'pomodoros' : []} for _ in range(num_users)] # [start, end, start, end, ..]    
users = {}

@app.route('/react_src')
def root():
    os.chdir('./app/src')
    return app.send_static_file('index.html')

def check_for_timeouts():
    # TODO: in case of timeout we could nevertheless add pomodoro
    for user_id in users:
        if time.time() - users[user_id]['last_update'] > 2:
            users[user_id]['pomodoro_state'] = POMODOROSTATE_OFFLINE
        
            
def new_user_template():
    return {'pomodoro_state' : POMODOROSTATE_OFFLINE,
            'pomodoro_start' : 0,
            'real_pomodoro_start' : 0,
            'last_update' : 0,
            'pomodoros' : []}
              
@app.route('/_user_status')
@cross_origin()
def user_status():

    user_id = request.args.get('user_id', type=str)
    if not user_id in users:
        users[user_id] = new_user_template()

    users[user_id]['pomodoro_state'] = request.args.get('pomodoro_state', 0, type=int)
    users[user_id]['pomodoro_start'] = request.args.get('pomodoro_start', 0, type=float) 
    users[user_id]['real_pomodoro_start'] = request.args.get('real_pomodoro_start', 0, type=float)
    users[user_id]['last_update'] = time.time()

    # Convert comma seperated string into float array
    # Make sure to not overwrite pomodoros saved on server
    # with empty pomodoro array that we get on first call
    retrieved_pomodoros = request.args.get('pomodoros', '', type=str)
    if retrieved_pomodoros:
        users[user_id]['pomodoros'] = [float(x) for x in retrieved_pomodoros.split(',')]
        
    # Friend IDs are also transferred via comma seperated strings
    friend_ids = request.args.get('friend_ids', '', type=str)
    if friend_ids:
        friend_ids = friend_ids.split(',')
    print('friend_ids ' + str(friend_ids))
    
    check_for_timeouts() # TODO: put this check somewhere else, just a hack
        
    # We only send as a response the friends of a user and the user herself
    # Sending the user herself is only nessecary on first call of user_states
    response_users = { user_id: users[user_id] }
    for friend_id in friend_ids:
        # If a friend hasn't logged in yet properly we create his record.
        if not friend_id in users:
            users[friend_id] = new_user_template()
        response_users[friend_id] = users[friend_id]

    print('whole database')
    print(users)
    print('feedback')
    print(response_users)
    return jsonify(users=response_users)

@app.route('/app')
def app_route():
    print(app.static_url_path)
    return render_template('app.html')


if __name__ == '__main__':
    app.run(host = '0.0.0.0')
