import React, {Component} from 'react';
import './App.css';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
// import routes from './routes';
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';

import TabPage from './components/TabPage';
import Pomodoros from './components/Pomodoros';
import SocialPomo from './components/SocialPomo';
import LoginPage from './components/LoginPage';

import {PomodoroState,} from './components/pomodoro/commons';

const tick = () => {
    // Todo: pomodoro tick stub
}

const users = [
    {
        id: 0,
        name: "Christian Reiser",
        active_pomodoro: "",
        progress: '2:30',
        pomodoro_start: null,
        pomodoro_state: PomodoroState.STOPPED,
        pomodoros: []
    },
    {
        id: 1,
        name: "Toni Väisänen",
        active_pomodoro: "",
        progress: '1:30',
        pomodoro_start: null,
        pomodoro_state: PomodoroState.STOPPED,
        pomodoros: []
    },
    {
        id: 2,
        name: "Foo Bar",
        active_pomodoro: "",
        progress: '4:30',
        pomodoro_start: null,
        pomodoro_state: PomodoroState.STOPPED,
        pomodoros: []
    }
];

const routes = [
    {
        path: '/',
        props: null,
        exact: true,
        main: () => <TabPage users={users}/>
    },
    {
        path: '/blueprint',
        props: null,
        exact: true,
        main: () => <TabPage users={users}/>
    },
    {
        path: '/pomodoros',
        props: null,
        exact: true,
        main: () => <SocialPomo users={users}/>
    },
    {
        path: '/login',
        props: null,
        exact: true,
        main: () => <LoginPage/>
    }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: null,
            counter: 0,
            delta_t: 0,
            users: [
                {
                    id: 0,
                    name: "Christian Reiser",
                    active_pomodoro: "",
                    progress: '2:30',
                    pomodoro_start: null,
                    pomodoro_state: PomodoroState.STOPPED,
                    pomodoros: []
                },
                {
                    id: 1,
                    name: "Toni Väisänen",
                    active_pomodoro: "",
                    progress: '1:30',
                    pomodoro_start: null,
                    pomodoro_state: PomodoroState.STOPPED,
                    pomodoros: []
                },
                {
                    id: 2,
                    name: "Foo Bar",
                    active_pomodoro: "",
                    progress: '4:30',
                    pomodoro_start: null,
                    pomodoro_state: PomodoroState.STOPPED,
                    pomodoros: []
                }
            ]
        },
            this.tick_clock = this.tick_clock.bind(this);

    }


    tick_clock() {
        // Increment the counter
        const incr_time = this.state.counter + 1;
        this.setState({counter: incr_time})

        // bind actions to the tick
        tick(this);
    }

    render() {
        return (
            <Router>
                <div className="App">

                    <Row>
                        <TopBar/>
                    </Row>

                    <Col sm={1} md={1}>
                        <SideBar/>
                    </Col>
                    <Col sm={11} md={11} lg={11}>
                        <div>
                            {routes.map((route, index) => (
                                // Render content for routes here
                                <Route
                                    key={index}
                                    path={route.path}
                                    exact={route.exact}
                                    component={route.main}
                                />
                            ))}</div>
                    </Col>
                </div>
            </Router>
        );
    }
}


export default App;

