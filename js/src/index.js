import 'babel-polyfill';
import * as d3 from 'd3';
import _ from 'lodash';

import * as constants from './constants.js';
import './style.css';

function component() {
  // create svg container
  let svgContainer = d3.select('body').append('svg')
		.attr('height', constants.svgHeight)
		.attr('width', constants.svgWidth)
    .attr('class', 'visualization-container');

  drawWalkingCirclesWithVaryingDiameters(svgContainer, constants.svgWidth/2, constants.svgHeight/2, 0, 1);

  const element = document.createElement('div');

  //element.innerHTML = 'Select visualization';
  element.classList.add('visualization');

  return element;
}

function drawWalkingCirclesWithVaryingDiameters(svgContainer, xCoord, yCoord, colorIndex, frameCount) {

  let maxRadius = constants.svgWidth/15;
  let minRadius = 10;
  let radius = Math.random() * (maxRadius - minRadius) + minRadius;

  // draw a circle
  let circle = svgContainer.append('circle')
    .attr('cx', xCoord)
    .attr('cy', yCoord)
    .attr('r',radius)
    .attr('fill', _.get(constants, ['eightiesColors', colorIndex]))
    .attr('color', _.get(constants, ['eightiesColors', colorIndex]));

  xCoord += Math.random() < 0.5 ? -50 : 50;
  yCoord += Math.random() < 0.5 ? -50 : 50;
  xCoord = Math.max(0, Math.min(xCoord, constants.svgWidth));
  yCoord = Math.max(0, Math.min(yCoord, constants.svgHeight));
  d3.timeout(
    drawWalkingCirclesWithVaryingDiameters.bind(null,
      svgContainer,
      xCoord,
      yCoord,
      ++colorIndex % 5,
      ++frameCount
    ), constants.drawDelay);

  if (frameCount % 150 == 0) {
    d3.selectAll("svg > *").remove();
  }

}

document.body.appendChild(component());
