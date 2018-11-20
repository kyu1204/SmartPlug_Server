import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Home, List } from 'pages';


class App extends Component {

  
    render() {
        return (
            <div>
                <Route exact path="/" component={Home}/>
                <Route exact path="/list" component={List}/>
            </div>
        );
    }
}

export default App;
