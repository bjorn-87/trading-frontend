import React from 'react';
import { Chart } from 'react-charts'


import io from 'socket.io-client';

import './StockPage.css';

const socket = io("http://localhost:8383");
const sroc = io("http://localhost:8383/prices");
// const socket = io('https://trading-server.bjos19.me');

function StockPage() {

  const data = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
      },
      {
        label: 'Series 2',
        data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
      }
    ],
    []
  )

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'time', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )
  dateTime();
  return (
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div className="StockPage">
    <div
      style={{
        width: '400px',
        height: '300px',
        margin: '0 auto'
      }}
    >
      <Chart data={data} axes={axes} />
    </div>
    </div>
  )
}

// function StockPage() {
//   // Use any data object you want
//   const originalData = React.useMemo(
//     () => ({
//       axis: [1, 2, 3],
//       lines: [
//         { data: [{ value: 10 }, { value: 10 }, { value: 10 }] },
//         { data: [{ value: 10 }, { value: 10 }, { value: 10 }] },
//         { data: [{ value: 10 }, { value: 10 }, { value: 10 }] }
//       ]
//     }),
//     []
//   )
//
//   // Make data.lines represent the different series
//   const data = React.useMemo(data => originalData.lines, [originalData])
//
//   // Use data.lines[n].data to represent the different datums for each series
//   const getDatums = React.useCallback(series => series.data, [])
//
//   // Use the original data object and the datum index to reference the datum's primary value.
//   const getPrimary = React.useCallback(
//     (datum, i, series, seriesIndex, data) => originalData.axis[i],
//     []
//   )
//
//   // Use data.lines[n].data[n].value as each datums secondary value
//   const getSecondary = React.useCallback(datum => datum.value, [])
//
//   return (
//     <div
//       style={{
//         width: '400px',
//         height: '300px'
//       }}
//     >
//       <Chart
//         data={data}
//         getSeries={getSeries}
//         getDatums={getDatums}
//         getPrimary={getPrimary}
//         getSecondary={getSecondary}
//       />
//     </div>
//   )
// }
export default StockPage;


// const cakes = this.state.cakes;
// {cakes.map((item, index) => (
//     <p key={index}>
//     {item.name}: {item.startingPoint}
//     </p>
// ))}
