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
      let { yes, no } = props.pollRecords

      console.log(yes.concat(no));

      var [ dataArray, rangeArray ] = sortVotes(yes, no)

      var minValue = rangeArray[0].y
      var maxValue = rangeArray[rangeArray.length-1].y
      var maxRange = Math.ceil((((maxValue * 0.2) + maxValue) /10 ) * 10)
      var minRange = Math.ceil((((minValue * 0.2) + minValue) /10 ) * 10) * -1

      const ctx = document.getElementById(chartId).getContext("2d")

      let range = minRange > maxRange ? minRange : maxRange

      var gradientStroke = ctx.createLinearGradient(0,337.5,0, 25)

      gradientStroke.addColorStop(1, 'rgba(255,51,138,0.225)')
      gradientStroke.addColorStop(0.7, 'rgba(255,51,138,0.2)')
      gradientStroke.addColorStop(0.5, 'rgba(255,51,138,0.125)')
      gradientStroke.addColorStop(0.2, 'rgba(255,51,138,0.075)')
      gradientStroke.addColorStop(0, 'rgba(119,52,169,0)')

      var startingDate = new Date(dataArray[0].x - 21600000)
      startingDate.setMinutes(0);
      startingDate.setSeconds(0);
      startingDate.setHours(0);

      dataArray.sort((a,b) => { return a.x - b.x })

      dataArray.unshift({
        x: startingDate.getTime(), y: 0
      })

      console.log(dataArray)

      var data = {
        datasets: [{
          ...CHARTS.SPLINE_STYLE(gradientStroke),
          data: dataArray,
        }]
      }

      new Chart(ctx, { ...CHARTS.SPLINE_CONFIG(data, range) })
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
