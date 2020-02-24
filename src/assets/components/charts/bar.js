import React, { Fragment, useEffect, useState } from 'react'
import Chart from 'chart.js';

import { CHARTS } from "../../../constants/parameters.js";

function Bar(props) {
  const { chartId } = props;

  useEffect(() => {
    const composeAndRender = () => {
      let { yes, no } = props.pollCount;

      const ctx = document.getElementById(chartId).getContext("2d")
      const total = (value) => (value / (yes + no)) * 100
      const data = [ total(yes), total(no) ]

      new Chart(ctx, { ...CHARTS.BAR_CONFIG(data, 100, props.type) })
    }
    composeAndRender()
  }, [ ])

  return(
    <div className="chart-container">
      <canvas id={chartId}> </canvas>
    </div>
  );
}

export default Bar;
