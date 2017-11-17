import React, {Component} from 'react';
import './App.css';

import PomodoroLive from './components/PomodoroLive';
import PomodoroOverview from './components/PomodoroOverview';
import PomodoroNavbar from './components/PomodoroNavbar';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (

                <div className="App">
                    <PomodoroNavbar/>
                    <PomodoroLive />
                    <PomodoroOverview />

                </div>

        );
    }
}

export default App;


