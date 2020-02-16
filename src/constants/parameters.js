import { PINK_PRIMARY } from "./palette.js"

export const CONTRACT_ADDRESS = "0x61a8598eabb7bddca95d3783c228878cd788e0a9"

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wendsday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]
export const CHARTS = {
  BAR_CONFIG: (_data, _range) => ({
    type: 'horizontalBar',
    responsive: true,
    data: {
      labels: ['Yes','No' ],
      datasets: [{
        data: _data,
        borderColor: PINK_PRIMARY,
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
        xAxes: [{
          type: 'time',
          time: {
            unit: 'millisecond',
            unitStepSize: 43200000,
            displayFormats: {
              millisecond: 'hA'
            }
          },
        }],
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

export const CONTRACT_ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_data",
				"type": "string"
			},
			{
				"name": "_deadline",
				"type": "uint64"
			}
		],
		"name": "newVoteProposal",
		"outputs": [
			{
				"name": "newProposal",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "proposal",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "issuer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "deadline",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "data",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "optionA",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "optionAaddr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "optionB",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "optionBaddr",
				"type": "address"
			}
		],
		"name": "newProposalIssued",
		"type": "event"
	}
]
