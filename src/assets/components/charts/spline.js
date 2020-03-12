import React, { Fragment, useEffect, useState } from 'react'
import Chart from 'chart.js'

import { WEEKDAYS, CHARTS } from '../../../constants/parameters.js'
import { sortVotes } from '../../../constants/operatives.js'

const makeRepeated = (arr, repeats) =>
  [].concat(...Array.from({ length: repeats }, () => arr));

function Spline(props){
  let { chartId } = props

  useEffect(() => {
    const composeAndRender = () => {
      let { yes, no } = props.pollRecords

      var dataArray = sortVotes(yes, no)

      const ctx = document.getElementById(chartId).getContext('2d')

      var gradientStroke = ctx.createLinearGradient(0,337.5,0, 25)

      gradientStroke.addColorStop(1, 'rgba(255,51,138,0.225)')
      gradientStroke.addColorStop(0.7, 'rgba(255,51,138,0.2)')
      gradientStroke.addColorStop(0.5, 'rgba(255,51,138,0.125)')
      gradientStroke.addColorStop(0.2, 'rgba(255,51,138,0.075)')
      gradientStroke.addColorStop(0, 'rgba(119,52,169,0)')

      dataArray.sort((a,b) => { return a.x - b.x })

      var data = {
        datasets: [{
          ...CHARTS.SPLINE_STYLE(gradientStroke),
          data: dataArray,
        }]
      }

      new Chart(ctx, { ...CHARTS.SPLINE_CONFIG(data, 100) })
    }
    composeAndRender()
  }, [ ])

  return(
    <Fragment>
      <canvas id={chartId}> </canvas>
    </Fragment>
  )
}

export default Spline;
