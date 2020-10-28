import React, { Component } from 'react';
import Chart from 'react-apexcharts';
// import Rickshaw from 'rickshaw';
// import 'rickshaw/rickshaw.min.css';
import io from 'socket.io-client';

import './StockPage.css';

const socket = io("http://localhost:8383");
// const socket = io('https://trading-server.bjos19.me');
const price = "http://localhost:8383/prices";


class StockPage extends React.Component {
        constructor(props) {
          super(props);

          this.state = {

            series: [{
              data: data.slice()
            }],
            options: {
              chart: {
                id: 'realtime',
                height: 350,
                type: 'line',
                animations: {
                  enabled: true,
                  easing: 'linear',
                  dynamicAnimation: {
                    speed: 1000
                  }
                },
                toolbar: {
                  show: false
                },
                zoom: {
                  enabled: false
                }
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                curve: 'smooth'
              },
              title: {
                text: 'Dynamic Updating Chart',
                align: 'left'
              },
              markers: {
                size: 0
              },
              xaxis: {
                type: 'datetime',
                range: XAXISRANGE,
              },
              yaxis: {
                max: 100
              },
              legend: {
                show: false
              },
            },


          };
        }


        componentDidMount() {
          window.setInterval(() => {
            getNewSeries(lastDate, {
              min: 10,
              max: 90
            })

            Chart.exec('realtime', 'updateSeries', [{
              data: data
            }])
          }, 1000)
        }


        render() {
          return (


      <div id="chart">
        <Chart options={this.state.options} series={this.state.series} type="line" height={350} />
    </div>
);
}
}

export default StockPage;
