export const CONTRACT_ADDRESS = '0x02fa40765725717f9476ebe80db1b98b4f3b2120'

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wendsday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]
export const CHARTS = {
  BAR_CONFIG: (_data, _range, type) => {

    if(type) return({
    type: 'horizontalBar',
    responsive: true,
    data: {
      labels: ['Yes', 'No'],
      datasets: [{
        data: _data,
        borderColor: '#d048b6',
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: -50
        }
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          gridLines: {
            display:false
          },
          ticks: {
            suggestedMin: 0,
            padding: 0,
            callback: function(label, index, labels) {
              label = '';
              return label;
            }
          }
        }],
        yAxes: [{
          gridLines: {
            display:false
          },
          ticks: {
            fontColor: '#d048b6',
            fontStyle: 'bold',
            fontSize: 13,
            mirror: true
          },
        }]
      },
    }})
    else if(!type) return({
    type: 'horizontalBar',
    responsive: true,
    data: {
      labels: ['Yes', 'No'],
      datasets: [{
        data: _data,
        borderColor: '#d048b6',
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: false },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: -50
        }
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
          },
          ticks: {
            mirror: true,
            suggestedMin: 0,
            callback: function(label, index, labels) {
              label = ''
              return label
            }
          }
        }]
      },
    }})
  },
  SPLINE_CONFIG: (_data, _range) => {
   var dateCheck = {}

   return({
    options: {
      lineTension: 100,
      bezierCurve: true,
      legend: { display: false },
      tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function(items, data) {
               var percent = items.yLabel
               var yes;
               var no;

               if(percent > 55){
                 no = (100 - percent).toFixed(2)
                 yes = percent.toFixed(2)
                } else {
                 yes = (100 - percent).toFixed(2)
                 no = percent.toFixed(2)
                }

                return ` Yes: ${yes}% \n No: ${no}%`
             }
          }
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'month',
            unitStepSize: 1,
            displayFormats: {
              month: 'MMM'
            }
          }
        }],
        yAxes: [{
          id:'yAxis1',
          ticks: {
            min: 0,
            max: _range,
            callback: function(label, index, labels) {
              label = ''
              return label
            }
          }
        },
        {
          id:'yAxis2',
          labels: ['Yes', '', 'No'],
          type:'category',
          gridLines: {
           drawOnChartArea: true,
           display: true,
           color: [
             'rgba(0, 0, 0, 0.1)',
             'rgba(0, 0, 0, 0.5)',
             'rgba(0, 0, 0, 0.1)'
           ]
          },
       }]
      },
    },
    type: 'line',
    data: _data,
    })
  },
  SPLINE_STYLE: _gradient => ({
    label: 'Data',
    fill: true,
    backgroundColor: _gradient,
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
  })
}

export const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "proposal",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "deadline",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "data",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "optionA",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "optionAaddr",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "optionB",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "optionBaddr",
				"type": "address"
			}
		],
		"name": "newProposalIssued",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_data",
				"type": "string"
			},
			{
				"internalType": "uint32",
				"name": "_deadline",
				"type": "uint32"
			}
		],
		"name": "newVoteProposal",
		"outputs": [
			{
				"internalType": "contract VoteProposal",
				"name": "newProposal",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
