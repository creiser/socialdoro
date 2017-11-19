import React, {Component} from 'react';
import './App.css';

import FBLogingComponent, {fbLogin, getUserFriendlists} from './components/FBActions';
import PomodoroLive from './components/PomodoroLive';
import PomodoroPersonal from './components/PomodoroPersonal';
import PomodoroOverview from './components/PomodoroOverview';
import PomodoroNavbar from './components/PomodoroNavbar';
import $ from 'jquery';

import {PomodoroState, get_rel_time, pomodoro_time, break_time, getUrlParameter} from './Util';
import {Button, Col, Row} from 'react-bootstrap';


class App extends Component {
    constructor(props) {
        super(props);
		
		// For the moment I just kept the user_id variable, so the code only has to be minimally adapted.
        this.state = {
			user_id: "",
            users: null,
            facebook_user: null,
            facebook_friends: []
        };

        this.got_first_update = false;
        this.setFBuser = this.setFBuser.bind(this);
        this.setFBFriends = this.setFBFriends.bind(this);
        this.logoutFBuser = this.logoutFBuser.bind(this);
    }
	

    setFBuser(user){
        this.setState({user_id: user.id, facebook_user: user});
		
        if (this.state.user_id) {
            getUserFriendlists(this.state.user_id, (response) =>  {
				var facebook_friends = response.data;
				
				console.log(facebook_friends);
				console.log(this.state.facebook_user);

				// Initialize friends to default values.
				// And add facebook info (name, picture) to record so it can be easily accesed
				// together with the user.
				let users = {};
				for (let i = 0; i < facebook_friends.length; i++) {
					users[facebook_friends[i].id] = {};
					users[facebook_friends[i].id].pomodoro_state = PomodoroState.OFFLINE;
					users[facebook_friends[i].id].pomodoro_start = 0;
					users[facebook_friends[i].id].real_pomodoro_start = 0;
					users[facebook_friends[i].id].pomodoros = [];
					users[facebook_friends[i].id].name = facebook_friends[i].name;
					users[facebook_friends[i].id].picture = facebook_friends[i].picture.data.url;
				}
				
				// Initalize the logged in user.
				// Ugly copy & paste: (only pomodoro_state, name, picture are different)
				users[this.state.user_id] = {};
				users[this.state.user_id].pomodoro_state = PomodoroState.STOPPED;
				users[this.state.user_id].pomodoro_start = 0;
				users[this.state.user_id].real_pomodoro_start = 0;
				users[this.state.user_id].pomodoros = [];
				users[this.state.user_id].name = this.state.facebook_user.name;
				users[this.state.user_id].picture = this.state.facebook_user.picture.data.url;
				
				console.log(users);
				console.log("fb friends:");
				console.log(facebook_friends);
				
                this.setState({users: users,
					facebook_friends: facebook_friends});
            });
        }
    }

    setFBFriends(users){
        this.setState({facebook_friends: users});
    }

    logoutFBuser(){
        const username = this.state.facebook_user.name;
        this.setState({facebook_user: null})
        alert('User ' + username + 'logged out!');
    }

    componentDidMount() {
		// Render at 33 fps (1000 / 30 = 33)
        this.timerID = setInterval(
            () => this.tick(),
            33
        );
		
		// Server contact only every second
		this.userStatusId = setInterval(
			() => this.user_status(),
			1000
		);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }
	
	array_to_string(array) {
		var string = "";
        for (var i = 0; i < array.length; i++) {
            string += array[i];
            if (i != array.length - 1)
                string += ",";
        }
		return string;
	}

    user_status() {
		if (!this.state.users) {
			return;
		}
		
        var current_user = this.state.users[this.state.user_id];

        // Convert list to string of comma seperated values for GET request
        // TODO: more elegant by just sending everything as a single JSON object
        var pomodoros_string = this.array_to_string(current_user.pomodoros);
		console.log(current_user.pomodoros);
		
		// Just create a list of current users friends that are then passed to the server
		var friend_ids = [];
		for (var i = 0; i < this.state.facebook_friends.length; i++) {
			friend_ids.push(this.state.facebook_friends[i].id);
		}
		var friend_string = this.array_to_string(friend_ids);

        var pass_this = this;

        $.getJSON('http://127.0.0.1:5000/_user_status', {
            user_id: this.state.user_id,
            pomodoro_state: current_user.pomodoro_state,
            pomodoro_start: current_user.pomodoro_start,
            real_pomodoro_start: current_user.real_pomodoro_start,
            pomodoros: pomodoros_string,
			friend_ids: friend_string
        }, function (data) {
            var users = JSON.parse(JSON.stringify(pass_this.state.users)); // Important to work on copy with React!
			
			// Copy everything except state of logged in user, because we have
            // locally more recent state of logged in user.
			for (var fb_id in users) {
				// check if the property/key is defined in the object itself, not in parent
				if (users.hasOwnProperty(fb_id) && fb_id != pass_this.state.user_id) {
					//users[fb_id] = data.users[fb_id];
					users[fb_id].pomodoro_state = data.users[fb_id].pomodoro_state;
					users[fb_id].pomodoro_start = data.users[fb_id].pomodoro_start;
					users[fb_id].real_pomodoro_start = data.users[fb_id].real_pomodoro_start;
					users[fb_id].pomodoros = data.users[fb_id].pomodoros;
					console.log('yolo');
				}
			}
            // Copy everything except state of logged in user, because we have
            // locally more recent state of logged in user.
            /*for (var i = 0; i < pass_this.state.users.length; i++) {
                if (i != pass_this.state.user_id) {
                    users[i] = data.users[i];
            }*/

            // At the beginning retrieve pomodoros from server after
            // that we are again in possession of more recent info.
            if (!pass_this.got_first_update) {
                users[pass_this.state.user_id].pomodoros = data.users[pass_this.state.user_id].pomodoros;
                pass_this.got_fist_update = true;
            }

            // Push changes to React.
            pass_this.setState({users: users});
			//console.log(pass_this.state.users);
        });

    }

	// pass now users since we work on a real copy of the data
    add_pomodoro(users) {
        users[this.state.user_id].pomodoros.push(this.state.users[this.state.user_id].real_pomodoro_start);
        users[this.state.user_id].pomodoros.push(get_rel_time());
    }

    tick() {
		if (!this.state.users) {
			return;
		}
		
		var users = JSON.parse(JSON.stringify(this.state.users));
		var current_user = users[this.state.user_id];

		// We go from pomodoro to break and vice versa, if the pomodoro respective break time is over
		if (current_user.pomodoro_state == PomodoroState.POMODORO || current_user.pomodoro_state == PomodoroState.BREAK) {
			// first check if we have to go to a new state
			if (current_user.pomodoro_state == PomodoroState.POMODORO && get_rel_time() > current_user.pomodoro_start + pomodoro_time) {
				current_user.pomodoro_state = PomodoroState.BREAK;
				this.add_pomodoro(users);
			} else if (current_user.pomodoro_state == PomodoroState.BREAK && get_rel_time() > current_user.pomodoro_start + pomodoro_time + break_time) {
				current_user.pomodoro_state = PomodoroState.POMODORO;
				users[this.state.user_id].real_pomodoro_start = current_user.pomodoro_start = current_user.pomodoro_start + pomodoro_time + break_time;
			}
		}
		
		users[this.state.user_id] = current_user;
		this.setState({users: users});
    }

    handleControlClick() {
        var users = JSON.parse(JSON.stringify(this.state.users));

        if (users[this.state.user_id].pomodoro_state == PomodoroState.STOPPED) {
            users[this.state.user_id].pomodoro_state = PomodoroState.POMODORO;
            users[this.state.user_id].real_pomodoro_start = users[this.state.user_id].pomodoro_start = get_rel_time();
        } else /* if (pomodoro_state == PomodoroState.POMODORO || pomodoro_state == PomodoroState.BREAK) */ {
            users[this.state.user_id].pomodoro_state = PomodoroState.STOPPED;
            this.add_pomodoro(users);
        }

        this.setState({users: users});
    }

    handleSyncClick(partner_id) {
        var users = JSON.parse(JSON.stringify(this.state.users));

        // If we are right now in a pomodoro, save it as a seperate unit.
        if (users[this.state.user_id].pomodoro_state == PomodoroState.POMODORO) {
            this.add_pomodoro(users);
        }

        // Here is why we introduced real_pomodoro_start, because in this
        // scenario pomodoro_start and real_pomodoro_start diverge.
        users[this.state.user_id].real_pomodoro_start = get_rel_time();
        users[this.state.user_id].pomodoro_start = users[partner_id].pomodoro_start;
        users[this.state.user_id].pomodoro_state = users[partner_id].pomodoro_state;

        this.setState({users: users});
    }


    render() {
        const userLogged = this.state.facebook_user != null;
        let userIcon = "";
        let userName = "Not logged in.";
		
		let displayLoginButton = "block";

        if (userLogged) {
            userIcon = this.state.facebook_user.picture.data.url;
			userName = this.state.facebook_user.name;
			displayLoginButton = "none";
			
        } else {
            // show stuff and the user icon
        }
		
        return (
            <div className="app">

                <PomodoroNavbar
                    userIcon={userIcon}
                    userName={userName}
                    logout={this.logoutFBuser}
					userLogged={userLogged}
                />

                <Col xs={4} sm={4} md={2} lg={2} xsOffset={4} smOffset={4} mdOffset={5} lgOffset={5} style={{ display: displayLoginButton }}>
                   <FBLogingComponent
                       setLoggedUser={this.setFBuser} />
                    <div id="debug"></div>
                </Col>
				
				<Col xs={4} sm={4} md={2} lg={2} xsOffset={4} smOffset={4} mdOffset={5} lgOffset={5}>
					<PomodoroPersonal
						user_id={this.state.user_id}
						users={this.state.users}
						onControlClick={() => this.handleControlClick()} />

				</Col>

				<Col xs={10} sm={8} md={6} lg={6} xsOffset={1} smOffset={2} mdOffset={3} lgOffset={3}>
					<PomodoroLive
						user_id={this.state.user_id}
						users={this.state.users}
						onSyncClick={(partner_id) => this.handleSyncClick(partner_id)}/>
				</Col>

			   <Col xs={10} sm={8} md={6} lg={6} xsOffset={1} smOffset={2} mdOffset={3} lgOffset={3}>
					<PomodoroOverview />
				</Col>
            </div>
        );
    }
}

export default App;

