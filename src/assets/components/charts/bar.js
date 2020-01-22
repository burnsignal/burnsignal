import React, { Component } from 'react';
import Chart from 'chart.js';

class Bar extends Component {

  componentDidMount() {
          var ctx = document.getElementById(this.props.chartId).getContext("2d");

          const { yesCount, noCount } = this.props;

          const maximumValue = yesCount > noCount ? yesCount : noCount;
          const maximumRange = ( maximumValue * 0.20 ) + maximumValue;

          var myChart = new Chart(ctx, {
            type: 'horizontalBar',
            responsive: true,
            data: {
              labels: ['Yes','No' ],
              datasets: [{
                data: [ yesCount, noCount ],
                borderColor: ['#338aff',  '#ff4233'],
                borderWidth: 2,
                fill: true
              }]
            },
            options: {
              legend: { display: false },
              scales: {
                xAxes: [{
                  display: true,
                  ticks: {
                    suggestedMin: 0,
                    max: maximumRange
                  }
                }]
              },
            }
          });
  }

 render() {
   return(
      <div class="chart-area">
        <canvas id={this.props.chartId}> </canvas>
      </div>
    );
  }
}

export default Bar;
