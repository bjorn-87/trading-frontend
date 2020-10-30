import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import GetUrl from '../div/GetUrl.js';
import PropTypes from "prop-types";

import "./Auth.css";
import "../div/Buttons.css";
import "../div/Input.css";


class LogOut extends Component {
    componentDidMount() {
        localStorage.clear();
        this.props.loggedIn(false);
    }

    render() {
        return <Redirect to="/" />;
    }
}

class Login extends Component {
    constructor(props) {
        super(props);

        this.baseUrl = GetUrl();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.RegisterMessage = this.RegisterMessage.bind(this);
        this.state = {
            redirect: null,
            message: "",
            email: "",
            password: ""
        };
    }

    handleSubmit(event) {
        const payload = {
            email: this.state.email,
            password: this.state.password
        };
        // console.log(payload);

        fetch(`${this.baseUrl}login`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    this.props.loggedIn(true);
                    localStorage.setItem('user', res.data.user.email);
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('loggedIn', true);

                    // console.log(localStorage);
                    this.setState({
                        message: res.data.message,
                        redirect: "/mypage"
                    });
                } else {
                    this.setState({message: res.errors.detail});
                }
            });
        event.preventDefault();
    // alert(`submitted${this.state.email}`);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    RegisterMessage() {
        const message = localStorage.getItem('message');

        if (message) {
            localStorage.removeItem('message');
            return <h3>User successfully registered!</h3>;
        } else {
            return "";
        }
    }


    render() {
        const redirect = this.state.redirect;

        if (redirect) {
            return <Redirect to={redirect} />;
        }
        return (
            <main className="loginPage">
                <h2 className="stockTitle">Logga in</h2>
                <this.RegisterMessage />
                <p>{this.state.message}</p>
                <form className="input-form" onSubmit={this.handleSubmit}>
                    <label className="input-label">
                        E-Post
                    </label>
                    <input
                        id="email"
                        className="input"
                        type="email"
                        name="email"
                        placeholder="E-post"
                        required
                        value={this.state.email}
                        onChange={this.handleChange} />
                    <label className="input-label">
                        Lösenord
                    </label>
                    <input
                        id="password"
                        className="input"
                        type="password"
                        name="password"
                        placeholder="Lösenord"
                        required
                        value={this.state.password}
                        onChange={this.handleChange} />
                    <input
                        id="subBtn"
                        className="button green-button"
                        type="submit"
                        value="Login"
                    />
                </form>
            </main>
        );
    }
}

LogOut.propTypes = {
    loggedIn: PropTypes.func.isRequired,
};

Login.propTypes = {
    loggedIn: PropTypes.func.isRequired,
};

export {Login, LogOut};
