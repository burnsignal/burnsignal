import { PINK_PRIMARY, BLUE_PRIMARY, RED_PRIMARY } from "./palette.js"

export const WEEKDAYS =  ['Monday', 'Tuesday', 'Wendsday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]

export const CHARTS = {
  BAR_CONFIG: (_data, _range) => ({
    type: 'horizontalBar',
    responsive: true,
    data: {
      labels: ['Yes','No' ],
      datasets: [{
        data: _data,
        borderColor: [ BLUE_PRIMARY, RED_PRIMARY ],
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      legend: { display: false },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: "Wei (ETH)"
          },
          ticks: {
            suggestedMin: 0,
            max: _range,
            callback: function(label, index, labels) {
              if(label > 1e8 || label < (-1 * 1e8)){
                 return label.toExponential()
              } else return label;
            }
          }
        }]
      },
    }
  }),
  SPLINE_CONFIG: (_data, _range) => ({
    options: {
      lineTension: 100,
      bezierCurve: true,
      legend: { display: false },
      scales: {
        yAxes: [{
          id:'yAxis1',
          scaleLabel: {
            labelString: "Wei (ETH)",
            display: true
          },
          ticks: {
            min: (_range * -1),
            max: _range,
            callback: function(label, index, labels) {
              if(label > 1e8 || label < (-1 * 1e8)){
                return label.toExponential()
              } else return label;
            }
          }
        },
        {
          id:'yAxis2',
          labels: ['', 'Yes', '', 'No', ''],
          type:"category",
          gridLines: {
           drawOnChartArea: false,
           display: false
          },
       }]
      },
    },
    type: 'line',
    data: _data,
  }),
  SPLINE_STYLE: _gradient => ({
    label: "Data",
    fill: true,
    backgroundColor: _gradient,
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
  })
}
