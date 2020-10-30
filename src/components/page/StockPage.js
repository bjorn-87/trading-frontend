import React, { Component } from 'react';
import Rickshaw from 'rickshaw';
import GetUrl from '../div/GetUrl.js';
import 'rickshaw/rickshaw.min.css';
import io from 'socket.io-client';

import './StockPage.css';
import '../div/Buttons.css';
import '../div/Input.css';

const socket = io(GetUrl());
// const socket = io("http://localhost:8383");
// const socket = io('https://trading-server.bjos19.me');

class StockPage extends Component {
    constructor(props) {
        super(props);

        this.baseUrl = GetUrl();
        this.slugify = this.slugify.bind(this);
        this.updateDiagram = this.updateDiagram.bind(this);
        this.drawStockChart = this.drawStockChart.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            message: "",
            first: true,
            graphs: {},
            stocks: [],
            loggedIn: false,
            user: "",
            price: "",
            token: "",
            clicked: "",
            "Salt sill": 0,
            Skolkrita: 0
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
                token: token
            });
        }
        var palette = new Rickshaw.Color.Palette({ scheme: 'munin' });
        var graphContainer = document.getElementById('graphContainer');
        const graphElement0 = document.getElementById('graphElement0');
        const graphElement1 = document.getElementById('graphElement1');

        socket.on('connection', function() {
            console.log("connected");
        });

        socket.on('stocks', (stocks) => {
            let first = this.state.first;

            this.setState({
                stocks: stocks
            });

            if (first) {
                this.drawStockChart(stocks[0], palette, graphElement0, graphContainer);
                this.drawStockChart(stocks[1], palette, graphElement1, graphContainer);

                this.setState({
                    first: false
                });
            }
            this.updateDiagram(stocks[0]);
            this.updateDiagram(stocks[1]);
        });
    }

    updateDiagram(stock) {
        let data = {};
        var graphs = this.state.graphs;
        let slug = this.slugify(stock.name);

        data[stock.name] = stock.startingPoint;
        graphs[slug].graph.series.addData(data);
        graphs[slug].graph.render();

        return stock;
    }

    drawStockChart(stock, palette, graphElement, graphContainer) {
        var graphs = this.state.graphs;
        var graphResize;
        let slug = this.slugify(stock.name);
        let date = new Date();

        date.setHours(date.getHours());
        let graph = new Rickshaw.Graph({
            element: graphElement,
            width: "500",
            height: "200",
            renderer: "line",
            series: new Rickshaw.Series.FixedDuration([{
                name: stock.name,
                color: palette.color(),
            }], undefined, {
                timeInterval: 5000,
                maxDataPoints: 1000,
                timeBase: date.getTime() / 1000
            })
        });

        graphResize = function() {
            graph.configure({
                width: graphContainer.clientWidth,
            });
            graph.render();
        };

        graphResize();

        window.addEventListener('resize', graphResize);

        new Rickshaw.Graph.Axis.Time({
            graph: graph,
            timeFixture: new Rickshaw.Fixtures.Time.Local()
        });

        new Rickshaw.Graph.Axis.Y({
            graph: graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT
        });

        new Rickshaw.Graph.HoverDetail({
            graph: graph
        });

        graph.render();

        graphs[slug] = {
            name: stock.name,
            graph: graph,
        };

        this.setState({
            graphs: {...this.state.graphs, graphs}
        });
        return stock;
    }

    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w-]+/g, '')       // Remove all non-word chars
            .replace(/--+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    handleSubmit(event) {
        event.preventDefault();
        const clicked = this.state.clicked;
        const token = this.state.token;
        var url;
        var method;
        var stock = event.target.stock.value;
        var amount = this.state[stock];
        var price = event.target.price.value;
        var payload = {
            user: this.state.user,
            amount: amount,
            price: price,
            stock: stock
        };

        if (clicked === "buy") {
            url = `${this.baseUrl}order/buy`;
            method = 'POST';
        } else if (clicked === "sell") {
            url = `${this.baseUrl}order/sell`;
            method = 'PUT';
        }

        fetch(url, {
            method: method,
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
                    alert(res.data.msg);
                } else {
                    alert(res.errors.detail);
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

    render() {
        const prices = this.state.stocks;

        return (
            <div>
                <div className="stockPage">
                    <h1>Candy stock</h1>
                    <div id="graphContainer">
                        {prices[0] ? <h2>Salt sill</h2> : <h2>Loading...</h2>}
                        <div id="graphElement0"/>
                        {prices[0] ?
                            <p className="stockPrice">Stock value: {prices[0].startingPoint}</p>
                            : null}
                        {prices[1] ? <h2>Skolkrita</h2> : null}
                        <div id="graphElement1"/>
                        {prices[1] ?
                            <p className="stockPrice">Stock value: {prices[1].startingPoint}</p>
                            : null}
                    </div>
                </div>
                {this.state.loggedIn ?
                    <div className="stockFormHolder">
                        {prices.map((stock, index) => (
                            <form key={index} className="stockForm" onSubmit={this.handleSubmit}>
                                <input
                                    name="price"
                                    type="hidden"
                                    value={stock.startingPoint}
                                />
                                <input
                                    name="stock"
                                    type="hidden"
                                    value={stock.name}
                                />
                                <h3>{stock.name}</h3>
                                <p>Stock value: {stock.startingPoint} SEK</p>
                                <input
                                    className="input"
                                    name={stock.name}
                                    type="number"
                                    min="1"
                                    required
                                    value={this.state[stock.name]}
                                    onChange={this.handleChange}
                                />
                                <button
                                    className="button green-button"
                                    name="clicked"
                                    value="buy"
                                    onClick={this.handleChange}>
                                    Buy
                                </button>
                                <button
                                    className="button blue-button"
                                    name="clicked"
                                    value="sell"
                                    onClick={this.handleChange}>
                                    Sell
                                </button>
                            </form>
                        ))}
                    </div>
                    : null}
            </div>
        );
    }
}

export default StockPage;
