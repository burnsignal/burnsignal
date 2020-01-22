import React, { Component } from 'react';
import Chart from 'chart.js';

class Spline extends Component {

  componentDidMount() {
          var ctx = document.getElementById(`${this.props.chartId}-spline`).getContext("2d");

          var gradientStroke = ctx.createLinearGradient(0,337.5,0, 25);

          gradientStroke.addColorStop(1, 'rgba(255,51,138,0.225)');
          gradientStroke.addColorStop(0.7, 'rgba(255,51,138,0.2)');
          gradientStroke.addColorStop(0.5, 'rgba(255,51,138,0.125)');
          gradientStroke.addColorStop(0.2, 'rgba(255,51,138,0.075)');
          gradientStroke.addColorStop(0, 'rgba(119,52,169,0)');

          var data = {
            labels: ['JUL','AUG','SEP','OCT','NOV','DEC'],
            datasets: [{
              label: "Data",
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: '#d048b6',
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: '#d048b6',
              pointBorderColor:'rgba(255,255,255,0)',
              pointHoverBackgroundColor: '#d048b6',
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: [ 1, 10, 2, 5, 2, 5],
            }]
          };


        var myChart = new Chart(ctx, {
              options: { legend: { display: false }},
              type: 'line',
              data: data,
        });
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
