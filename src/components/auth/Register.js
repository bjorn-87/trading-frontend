import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import GetUrl from '../div/GetUrl.js';

import "./Register.css";
import "../div/Buttons.css";
import "../div/Input.css";

class Register extends Component {
    constructor(props) {
        super(props);

        this.baseUrl = GetUrl();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            email: "",
            password: "",
            message: "",
            redirect: false
        };
    }

    handleSubmit(event) {
        const payload = {
            email: this.state.email,
            password: this.state.password
        };
        // console.log(payload);

        fetch(`${this.baseUrl}register`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    this.setState({redirect: true});
                    localStorage.setItem('message', res.data.message);
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

    render() {
        const redirect = this.state.redirect;

        if (redirect) {
            return <Redirect to="/login"/>;
        } else {
            return (
                <main className="registerPage">
                    <h2 className="stockTitle">Registrera användare</h2>
                    <p>{this.state.message}</p>
                    <form className="input-form" onSubmit={this.handleSubmit}>
                        <label className="input-label">
                            E-Post
                        </label>
                        <input
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
                            className="input"
                            type="password"
                            name="password"
                            placeholder="Lösenord"
                            required
                            value={this.state.password}
                            onChange={this.handleChange} />
                        <input className="box" type="checkbox" required/>
                        <p className="gdpr"> Jag godkänner att min data sparas enlig gdpr. </p>
                        <input className="button blue-button" type="submit" value="Registrera" />
                    </form>
                </main>
            );
        }
    }
}

export default Register;
