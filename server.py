from flask import Flask, jsonify, render_template, request
import time
app = Flask(__name__)

#@app.route('/_send_status')
#def send_status():
#    pomodoro_status = request.args.get('pomodoro_status', 0, type=int)

debug_start = time.time() # seconds since 1970
num_users = 4
pomodoros = [[] for x in range(num_users)]

@app.route('/_add_pomodoro')
def add_pomodoro():
    user_id = request.args.get('user_id', type=int)
    pomodoro_start = request.args.get('start', type=float)
    pomodoro_end = request.args.get('end', type=float)
    pomodoros[user_id].append(pomodoro_start)
    pomodoros[user_id].append(pomodoro_end)
    print(pomodoros)
    return jsonify(result="Hello World!")

@app.route('/_get_pomodoros')
def get_pomodoros():
    return jsonify(pomodoros=pomodoros)

@app.route('/')
def index():
    user_id = request.args.get('user_id', 0, type=int)
    return render_template('index.html',
                           user_id=user_id,
                           num_users=num_users,
                           debug_start=debug_start,
                           pomodoros=pomodoros)