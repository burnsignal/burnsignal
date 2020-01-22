import React, { Component } from 'react';
import Chart from 'chart.js';

class Bar extends Component {

  componentDidMount() {
          console.log(this.props.chartId);
          var ctx = document.getElementById(this.props.chartId).getContext("2d");

          var gradientStroke = ctx.createLinearGradient(0,230,0,50);

          gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
          gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
          gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

          const { yesCount, noCount } = this.props;

          const maximumValue = yesCount > noCount ? yesCount : noCount;
          const maximumRange = ( maximumValue * 0.20 ) + maximumValue;

          var myChart = new Chart(ctx, {
            type: 'horizontalBar',
            responsive: true,
            data: {
              labels: ['Yes','No'],
              datasets: [{
                label: "Options",
                fill: true,
                backgroundColor: gradientStroke,
                hoverBackgroundColor: gradientStroke,
                borderColor: '#1f8ef1',
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                data: [ yesCount, noCount ],
              }]
            },
            options: {
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
