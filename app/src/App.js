import React, {Component} from 'react';
import './App.css';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import routes from './routes';
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';



class App extends Component {
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

