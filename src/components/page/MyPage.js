import React, {Component} from 'react';
import GetUrl from '../div/GetUrl.js';

import './MyPage.css';
import '../div/Input.css';
import '../div/Buttons.css';


class MyPage extends Component {
    constructor(props) {
        super(props);

        this.baseUrl = GetUrl();
        this.handleFetch = this.handleFetch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            user: "",
            account: 0,
            token: "",
            loggedIn: false,
            stocks: [],
            error: "",
            money: 0
        };
    }

    componentDidMount() {
        const loggedIn = localStorage.getItem('loggedIn') === 'true';
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (loggedIn) {
            this.setState({
                loggedIn: true,
                user: user,
                token: token,
            });
        }
        // console.log(this.state.user);
        this.handleFetch("user", user, token, "account");
        this.handleFetch("order", user, token, "stocks");
    }

    handleFetch(url, user, token, state) {
        const payload = {
            user: user
        };

        // console.log(token);
        // console.log(payload);
        fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify(payload)
        })
            .then((response) => response.json())
            .then((res) => {
                // console.log(res);
                if (res.data) {
                    this.setState({
                        [state]: res.data
                    });
                } else {
                    this.setState({error: res.errors.detail});
                }
            });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const token = this.state.token;
        const user = this.state.user;
        const money = this.state.money;

        const payload = {
            user: user,
            money: money,
            type: "insert"
        };
        // console.log(payload);

        fetch(`${this.baseUrl}user/account`, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify(payload)
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    alert(res.data.msg);
                    this.handleFetch("user", user, token, "account");
                    this.setState({
                        money: 0
                    });
                } else {
                    this.setState({error: res.errors.detail});
                }
            });
    }

    render() {
        const email = this.state.user;
        const account = this.state.account.account;
        const portfolio = this.state.stocks;
        const loggedIn = this.state.loggedIn;

        if (!loggedIn) {
            return (
                <div className="userPage">
                    <h1>Log in to see this page</h1>
                </div>
            );
        }
        return (
            <div className="userPage">
                <h1 className="stockTitle">My page</h1>
                <div>
                    <h3>User: {email}</h3>
                    <h3>Account: {account ? account.toFixed(2) : 0} SEK</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio.length > 0 ? portfolio.map((stock, index) => (
                                <tr key={index}>
                                    <td>{stock.stock}</td>
                                    <td>{stock.amount}</td>
                                </tr>
                            )) : null}
                        </tbody>
                    </table>
                    {portfolio.length === 0 ? <h3 className="noStock">No stocks yet</h3> : null}
                </div>
                <form className="input-form" onSubmit={this.handleSubmit}>
                    <label className="input-label">
                        Deposit
                    </label>
                    <input
                        className="input"
                        type="number"
                        name="money"
                        min="1"
                        required
                        value={this.state.money}
                        onChange={this.handleChange} />
                    <input type="submit" className="button green-button" value="Deposit"/>
                </form>
            </div>
        );
    }
}

export default MyPage;
