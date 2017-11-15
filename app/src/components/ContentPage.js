/**
 * Created by tvaisanen on 4/8/17.
 */

import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import routes from '../routes';


class ContentPage extends Component {
    componentDidMount() {
        console.log(routes);
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <Router>
                        <div>
                            {routes.map((route, index) => (
                                // Render more <Route>s with the same paths as
                                // above, but different components this time.
                                <Route
                                    key={index}
                                    path={route.path}
                                    exact={route.exact}
                                    component={route.main}
                                />
                            ))}
                        </div>
                    </Router>
                </div>
            </div>
        )
    }
}

export default ContentPage;

