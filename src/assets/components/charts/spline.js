import React, { Fragment, useEffect, useState } from 'react'
import Chart from 'chart.js'

import { WEEKDAYS, CHARTS } from "../../../constants/parameters.js"
import { sortVotes } from "../../../constants/operatives.js"

const makeRepeated = (arr, repeats) =>
  [].concat(...Array.from({ length: repeats }, () => arr));

function Spline(props){
  let { chartId } = props

  useEffect(() => {
    const composeAndRender = () => {
      let { yesVotes, noVotes } = props

      const dataArray = sortVotes(yesVotes, noVotes)

      var maxValue = Math.max(...dataArray)
      var minValue = Math.min(...dataArray)
      var maxRange = Math.ceil((((maxValue * 0.2) + maxValue) /10 ) * 10)
      var minRange = Math.ceil((((minValue * 0.2) + minValue) /10 ) * 10) * -1

      const ctx = document.getElementById(chartId).getContext("2d")

      let range = minRange > maxRange ? minRange : maxRange

      const labelArray = dataArray.length > WEEKDAYS.length ?
      makeRepeated(WEEKDAYS, parseInt(dataArray.length/WEEKDAYS.length)) :
      WEEKDAYS.slice(0, dataArray.length)

      var gradientStroke = ctx.createLinearGradient(0,337.5,0, 25)

      gradientStroke.addColorStop(1, 'rgba(255,51,138,0.225)')
      gradientStroke.addColorStop(0.7, 'rgba(255,51,138,0.2)')
      gradientStroke.addColorStop(0.5, 'rgba(255,51,138,0.125)')
      gradientStroke.addColorStop(0.2, 'rgba(255,51,138,0.075)')
      gradientStroke.addColorStop(0, 'rgba(119,52,169,0)')

      var data = {
        labels: labelArray,
        datasets: [{
          ...CHARTS.SPLINE_STYLE(gradientStroke),
          data: dataArray,
        }]
      }

      new Chart(ctx, { ...CHARTS.SPLINE_CONFIG(data, range) })
    }
    composeAndRender()
  }, [ props ])

  return(
    <Fragment>
      <canvas id={chartId}> </canvas>
    </Fragment>
  )
}

export default Spline;
