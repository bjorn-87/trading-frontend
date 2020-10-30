import React from 'react';
import {Link} from 'react-router-dom';

import ExitToApp from '@material-ui/icons/ExitToApp';
import Person from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Timeline from '@material-ui/icons/Timeline';

import Logo from '../../graph.svg';

import './NavBar.css';

const NavBar = (props) => {
    if (props.loggedIn) {
        return (
            <nav className="NavBar">
                <Link to="/">
                    <span className="logoText">
                        <img className="App-logo" src={Logo} alt="logo" />
                        <p>CandyExchange</p>
                    </span>
                </Link>
                <ul>
                    <li>
                        <Link to="/">
                            <span className="navBtn">
                                <Timeline/>
                                <p>Stocks</p>
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/mypage">
                            <span className="navBtn">
                                <Person/>
                                <p>My page</p>
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/logout">
                            <span className="navBtn">
                                <ExitToApp/>
                                <p>Log out</p>
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    } else {
        return (
            <nav className="NavBar">
                <Link to="/">
                    <span className="logoText">
                        <img className="App-logo" src={Logo} alt="logo" />
                        <p>CandyExchange</p>
                    </span>
                </Link>
                <ul>
                    <li>
                        <Link to="/register">
                            <span className="navBtn">
                                <PersonAddIcon/>
                                <p>Register</p>
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/login">
                            <span className="navBtn">
                                <ExitToApp/>
                                <p>Login</p>
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }
};

export default NavBar;
