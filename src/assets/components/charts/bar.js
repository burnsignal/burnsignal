import React, { Fragment, useEffect, useState } from 'react'
import Chart from 'chart.js';

import { CHARTS } from "../../../constants/parameters.js";

function Bar(props) {
  const { chartId } = props;

  useEffect(() => {
    const composeAndRender = () => {
      let { yesCount, noCount } = props;

      const ctx = document.getElementById(chartId).getContext("2d")
      const maximumValue = yesCount > noCount ? yesCount : noCount
      const range = ( maximumValue * 0.20 ) + maximumValue
      const data = [ yesCount, noCount];

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
