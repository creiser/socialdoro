from flask import Flask, jsonify, render_template, request
import time
app = Flask(__name__)

#@app.route('/_send_status')
#def send_status():
#    pomodoro_status = request.args.get('pomodoro_status', 0, type=int)

debug_start = time.time() # seconds since 1970
pomodoros = []

@app.route('/_add_pomodoro')
def add_pomodoro():
    pomodoro_start = request.args.get('start', type=float)
    pomodoro_end = request.args.get('end', type=float)
    pomodoros.append((pomodoro_start, pomodoro_end))
    print(pomodoros)
    return jsonify(result="Hello World!")

@app.route('/')
def index():
    return render_template('index.html',
                           debug_start=debug_start,
                           pomodoros=list(sum(pomodoros, ())))