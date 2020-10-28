import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

import StockPage from '../page/StockPage.js';
import {Login, LogOut} from '../auth/Auth.js';
import Register from '../auth/Register.js';
import NavBar from '../page/NavBar.js';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.changeHandler = this.changeHandler.bind(this);
        this.state = {
            loggedIn: false
        }
    }
    componentDidMount() {
        const loggedIn = localStorage.getItem('loggedIn') === 'true';

        if (loggedIn) {
            this.setState({
                loggedIn: true
            });
        }
    }

    changeHandler(bool) {
        this.setState({
            loggedIn: bool
        });
    }

    render() {
        const loggedIn = this.state.loggedIn;

        return (
            <Router>
                  <div className="App">
                      <header className="App-header" onClick={this.changeH}>
                          <NavBar loggedIn={loggedIn}/>
                      </header>
                      <div className="App-body" >
                          <Route exact path="/" component={StockPage} />
                          <Route exact path="/login" render={() =>
                              <Login loggedIn={this.changeHandler} />
                          }/>
                          <Route exact path="/register" component={Register} />
                          <Route exact path="/logout" render={() =>
                              <LogOut loggedIn={this.changeHandler} />
                          }/>
                      </div>
                      <footer className="pageFooter">
                          <p>&copy; Björn Olsson 2020</p>
                      </footer>
                </div>
            </Router>
        )
    }
}
export default App;
