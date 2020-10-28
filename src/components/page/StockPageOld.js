import React, { Component } from 'react';
import Rickshaw from 'rickshaw';
import 'rickshaw/rickshaw.min.css';
import io from 'socket.io-client';

import './StockPage.css';

const socket = io("http://localhost:8383");
// const socket = io('https://trading-server.bjos19.me');

var stockGraph = {
    graphs: {},
    data: [],
    time: [],
    first: true
}

class StockPage extends Component {
    constructor(props) {
        super(props);

        this.slugify = this.slugify.bind(this);
        this.stockDiagram = this.stockDiagram.bind(this);
        // this.graphHandler = this.graphHandler.bind(this);

        this.state = {
            first: true,
            history: [],
            stocks: [],
            graphs: {},
            graph: {}
        }
    }

    componentDidMount() {


        socket.on('connection', function() {
            console.log('connection');
        });

        this.stockDiagram();
    }

    stockDiagram() {
        var graphs = {};
        var graphHandler;
        console.log(this.state.graphs);
        socket.on('stocks', (stocks) => {
            var palette = new Rickshaw.Color.Palette({ scheme: 'munin' });
            var first = this.state.first
            // var first = stockGraph.first;
            console.log('stocks');

            // console.log(first);
            // console.log(graphs);
            // console.log(first);
            if (first) {
                let date = new Date();

                stocks.map((stock) => {
                    var graphContainer = document.getElementById('graphContainer');
                    var graphTitle = document.createElement("h1");
                    var graphElement = document.createElement("div")
                    let slug = this.slugify(stock.name);

                    graphElement.setAttribute("id", slug);

                    this.setState({stocks: [...this.state.stocks, stock]});
                    graphTitle.textContent = stock.name;

                    graphContainer.appendChild(graphTitle);
                    graphContainer.appendChild(graphElement);

                    date.setHours(date.getHours());

                    let graph = new Rickshaw.Graph({
                        element: graphElement,
                        width: "500",
                        height: "300",
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

                    graphHandler = function() {
                        graph.configure({
                            width: graphContainer.clientWidth,
                        });
                        graph.render();
                    }

                    graphHandler();

                    window.addEventListener('resize', graphHandler);

                    new Rickshaw.Graph.Axis.Time( { graph: graph, timeFixture: new Rickshaw.Fixtures.Time.Local() } );

                    new Rickshaw.Graph.Axis.Y({
                        graph: graph,
                        orientation: 'left',
                        tickFormat: Rickshaw.Fixtures.Number.formatKMBT
                    });

                    new Rickshaw.Graph.HoverDetail({
                        graph: graph
                    });
                    console.log(stockGraph.data);
                    // stockGraph.data.map((item) => {
                    //     console.log(item);
                    // });

                    graph.render();

                    graphs[slug] = {
                        name: stock.name,
                        graph: graph,
                    };

                    // if (stockGraph.data) {
                    //
                    //     let data = {};
                    //     let time = {};
                    //
                    //     for (var i = 0; i < stockGraph.data.length; i++) {
                    //         console.log();
                    //         console.log();
                    //         graphs[slug].graph.series.addData({princesstårta: stockGraph.time[i][stock.name], y: stockGraph.data[i][stock.name]});
                    //         // data[stock.name] =
                    //     }
                        // stockGraph.data.forEach((item) => {
                        //     console.log(item);
                        // });


                        // data[stock.name] = stockGraph.data[stock.name];
                        // time[stock.name] = stockGraph.time[stock.name];
                        // console.log(data);
                        // console.log(time);
                        // let result = [time, data];


                    //     graphs[slug].graph.render();
                    // }
                    // stockGraph.first = false;
                    this.setState({
                        // graphs: {...this.state.graphs, graphs},
                        first: false
                    });
                    return stock;
                });
            }
            // socket.emit('graphs', graphs);
            // console.log(graphs);
            stocks.map((stock) => {
                let date = new Date();
                date.setHours(date.getHours() + 1);

                let slug = this.slugify(stock.name);
                // console.log(slug);
                let data = {};
                let time = {};
                // console.log(graphs);
                data[stock.name] = stock.startingPoint;
                // data["timeBase"] = date.getTime() / 1000;
                time[stock.name] = date.getTime() / 1000;
                // console.log(data);
                stockGraph.data.push(data);
                stockGraph.time.push(time);
                // console.log(stockGraph.data);
                // console.log(stockGraph.time);
                // console.log(graphs[slug]);
                graphs[slug].graph.series.addData(data);
                graphs[slug].graph.render();
                return stock;
            });
            // console.log(this.state.first);

        });
    }

    // componentWillUnmount() {
    //     window.removeEventListener('resize', this.graphHandler);
    // }

    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w-]+/g, '')       // Remove all non-word chars
            .replace(/--+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    // graphHandler(event) {
    //     const stocks = this.state.stocks;
    //     const graphs = this.state.graphs;
    //
    //     stocks.map((stock) => {
    //         let slug = this.slugify(stock.name);
    //         let graphElement = document.getElementById(slug);
    //
    //         graphs.graphs[slug].graph.configure({
    //             width: graphElement.clientWidth,
    //         });
    //     });
    // }

    render() {

        return (
            <div className="stockPage">
                <h1>Trading site</h1>
                <div id="graphContainer"/>
            </div>
        );
    }
}

export default StockPage;


// const cakes = this.state.cakes;
// {cakes.map((item, index) => (
//     <p key={index}>
//     {item.name}: {item.startingPoint}
//     </p>
// ))}
