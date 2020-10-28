import React, { Component } from 'react';
import Rickshaw from 'rickshaw';
import 'rickshaw/rickshaw.min.css';
import io from 'socket.io-client';

import './StockPage.css';

const socket = io("http://localhost:8383");
// const socket = io('https://trading-server.bjos19.me');
const price = "http://localhost:8383/prices";

var stockGraph = {
    history: []
}

class StockPage extends Component {
    constructor(props) {
        super(props);

        this.slugify = this.slugify.bind(this);
        this.updateDiagram = this.updateDiagram.bind(this);
        this.drawStockChart = this.drawStockChart.bind(this);
        this.fetchHistory = this.fetchHistory.bind(this);
        // this.reDrawStockChart = this.reDrawStockChart.bind(this);

        this.state = {
            loading: true,
            first: true,
            graphs: {},
            graph: {}
        }
    }

    async componentDidMount() {
        await this.fetchHistory();

        var palette = new Rickshaw.Color.Palette({ scheme: 'munin' });

        socket.on('connection', function() {
        });

        socket.on('stocks', (stocks) => {
            this.setState({ loading: false });
            let first = this.state.first;

            stocks.map( async (stock) => {
                if (first) {
                    await this.drawStockChart(stock, palette);
                }
                this.updateDiagram(stock);
            });
        });
    }

    async fetchHistory() {
        if (stockGraph.history.length === 0) {
            console.log('fetching');
            await fetch(price)
            .then((response) => response.json())
            .then((res) => {
                stockGraph.history = res;
                },
                (error) => {
                    this.setState({
                        error
                    });
                });
        }

    }

    updateDiagram(stock) {
        let data = {};
        var graphs = this.state.graphs;

        let slug = this.slugify(stock.name);
        data[stock.name] = stock.startingPoint;
        graphs[slug].graph.series.addData(data);
        graphs[slug].graph.update();
        return stock;
    }

    drawStockChart(stock, palette) {
        let data = [];
        var graphs = this.state.graphs;
        var graphResize;
        let date = new Date();
        var graphContainer = document.getElementById('graphContainer');
        var graphTitle = document.createElement("h1");
        var graphElement = document.createElement("div")
        let slug = this.slugify(stock.name);

        graphElement.setAttribute("id", slug);

        graphTitle.textContent = stock.name;

        graphContainer.appendChild(graphTitle);
        graphContainer.appendChild(graphElement);

        date.setHours(date.getHours());

        stockGraph.history.forEach((item, i) => {
            if (item[stock.name]) {
                let defaultTime = data[0];
                data.push(item[stock.name]);
            }
        });

        let graph = new Rickshaw.Graph({
            element: graphElement,
            width: "500",
            height: "300",
            renderer: "line",
            series: new Rickshaw.Series.FixedDuration([{
                name: stock.name,
                color: palette.color(),
                data: data,
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
        }

        graphResize();

        window.addEventListener('resize', graphResize);

        new Rickshaw.Graph.Axis.Time({
            graph: graph,
            // timeFixture: new Rickshaw.Fixtures.Time.Local()
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
            graphs: {...this.state.graphs, graphs},
            first: false
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

    render() {
        if (this.state.loading) {
            return <h1>Loading....</h1>;
        } else {
            return (
                <div className="stockPage">
                <h1>Trading site</h1>
                <div id="graphContainer"/>
                </div>
            );
        }
    }
}

export default StockPage;
