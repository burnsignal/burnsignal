import React, { Component } from 'react';
import Chart from 'chart.js';

import { PINK_PRIMARY } from "../../../constants/palette.js";
const WEEKDAYS =  ['Monday', 'Tuesday', 'Wendsday', 'Thursday', 'Friday' ];

class Spline extends Component {

  componentDidMount = () => {
    const { yesVotes, noVotes } = this.props;

    const dataArray = this.sortVotes(yesVotes, noVotes);

    var ctx = document.getElementById(`${this.props.chartId}-spline`).getContext("2d");

    var gradientStroke = ctx.createLinearGradient(0,337.5,0, 25);

    gradientStroke.addColorStop(1, 'rgba(255,51,138,0.225)');
    gradientStroke.addColorStop(0.7, 'rgba(255,51,138,0.2)');
    gradientStroke.addColorStop(0.5, 'rgba(255,51,138,0.125)');
    gradientStroke.addColorStop(0.2, 'rgba(255,51,138,0.075)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)');

    const labelArray = WEEKDAYS.slice(0, dataArray.length);

    var data = {
      labels: labelArray,
      datasets: [{
        label: "Data",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: PINK_PRIMARY,
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: PINK_PRIMARY,
        pointBorderColor:'rgba(255,255,255,0)',
        pointHoverBackgroundColor: PINK_PRIMARY,
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: dataArray,
      }]
    };

    var myChart = new Chart(ctx, {
        options: {
          bezierCurve: true,
          legend: { display: false },
          scales: {
            yAxes: [{
              display: true,
            }]
          },
        },
        type: 'line',
        data: data,
    });
  }

 sortVotes = (_yesVotes, _noVotes) => {
   let totalVotes = _yesVotes.concat(_noVotes);

   totalVotes.sort((a,b) => { return a - b });

   totalVotes.unshift(0);

   return totalVotes;
 }

 render() {
   return(
      <div class="chart-area">
        <canvas id={`${this.props.chartId}-spline`}> </canvas>
      </div>
    );
  }
}

export default Spline;
