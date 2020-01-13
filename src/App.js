import React, { Component } from "react";
import Proposals from './components/Proposals';
import Deposits from './components/Deposits';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import "./black-dashboard/assets/css/black-dashboard-react.css";
import "./black-dashboard/assets/css/nucleo-icons.css";
import { getProposals } from "./utils/GraphHelper";
import { Container, Row, Col } from "reactstrap";
import "./App.css";
import Chart from 'chart.js';


class App extends Component {

  state = { proposals: [], deposits: [] };

  componentDidMount = async () => {
    try {
      // Loads all proposals using the subgraph
      var proposals = await getProposals();
      this.setState({ proposals: proposals });

      console.log('Attmepting Chart...');

      var ctx = document.getElementById("CountryChart").getContext("2d");

      var gradientStroke = ctx.createLinearGradient(0,230,0,50);

      gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
      gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors


      var myChart = new Chart(ctx, {
        type: 'bar',
        responsive: true,
        legend: {
              display: false
        },
        data: {
          labels: ['USA','GER','AUS','UK','RO','BR'],
          datasets: [{
            // type: 'horizontalBar',
            label: "Countries",
            fill: true,
            backgroundColor: gradientStroke,
            hoverBackgroundColor: gradientStroke,
            borderColor: '#1f8ef1',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: [ 53, 20, 10, 80, 100, 45],
          }]
        },
          //options: gradientBarChartConfiguration
      });

      var ctx = document.getElementById("chartLinePurple").getContext("2d");

      var gradientStroke = ctx.createLinearGradient(0,230,0,50);

      gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
      gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
      gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

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
          data: [ 80, 100, 70, 80, 120, 80],
        }]
      };

      var myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        // options: gradientChartOptionsConfigurationWithTooltipPurple
      });


    } catch (error) {
      alert(
        'Error loading The Graph',
      );
      console.error(error);
    }
  };

  render() {

    return (
      <div className="App">
        <NavBar></NavBar>
        <Container className='main-container'>

            <Row>
              <Col sm="12" md={{ size: 8, offset: 2 }}>
                <div className="card">
                  <div className="card-header">
                    <div className="title proposal">Should Ethereum implement EIR-1057 ProgPow?</div>
                  </div>
                  <div className="card-body">
                    <div className="github-detail">See GitHub for full details:</div>
                    <div className='buttons'>
                      <button className="btn btn-primary btn-simple vote-yes">Yes</button>
                      <button className="btn btn-primary btn-simple vote-no">No</button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm="12" md={{ size: 8, offset: 2 }}>
                <div className="card">
                  <div class="card-header">
                    <h5 class="card-category">Results</h5>
                    <h3 class="card-title"><i class="tim-icons icon-bell-55 text-primary"></i> 763,215</h3>
                  </div>
                  <div className="card-body">
                    <div class="chart-area">
                      <canvas id="CountryChart"></canvas>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm="12" md={{ size: 8, offset: 2 }}>
                <div className="card">
                  <div class="card-header">
                    <h5 class="card-category">Total Shipments</h5>
                    <h3 class="card-title"><i class="tim-icons icon-bell-55 text-primary"></i> 763,215</h3>
                  </div>
                  <div class="card-body">
                    <div class="chart-area">
                      <canvas id="chartLinePurple"></canvas>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
        </Container>
      </div>
    );
  }
}

export default App;
