import React, { Fragment, useEffect, useState } from 'react'
import Chart from 'chart.js';

import { CHARTS } from "../../../constants/parameters.js";

function Bar(props) {
  const { chartId } = props;

  useEffect(() => {
    const composeAndRender = () => {
      let { yes, no } = props.pollCount;

      const ctx = document.getElementById(chartId).getContext("2d")
      const maximumValue = yes > no ? yes : no
      const range = ( maximumValue * 0.20 ) + maximumValue
      const data = [ yes, no ]

      new Chart(ctx, { ...CHARTS.BAR_CONFIG(data, range) })
    }
    composeAndRender()
  }, [ props ])

  return(
    <Fragment>
      <canvas id={chartId}> </canvas>
    </Fragment>
  );
}

export default Bar;
