import 'babel-polyfill';
import * as d3 from 'd3';
import _ from 'lodash';

import * as constants from './constants.js';
import printSvg from './print.js';
import './style.css';

function component() {
  // create svg container
  let svgContainer = d3.select('body').append('svg')
		.attr('height', constants.svgHeight)
		.attr('width', constants.svgWidth)
    .attr('class', 'visualization-container');

  drawWalkingCirclesWithVaryingDiameters(svgContainer, constants.svgWidth/2, constants.svgHeight/2, 0, 1);

  const mainDiv = document.createElement('div');
  mainDiv.classList.add('pure-g');

  const leftDiv = document.createElement('div');
  leftDiv.classList.add('pure-u-1');
  leftDiv.classList.add('pure-u-md-1-2');
  leftDiv.classList.add('pure-u-xl-1-3');
  leftDiv.classList.add('center-aligned-div');
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('pure-u-1');
  rightDiv.classList.add('pure-u-md-1-2');
  rightDiv.classList.add('pure-u-xl-2-3');
  rightDiv.classList.add('center-aligned-div');
  mainDiv.appendChild(leftDiv);
  mainDiv.appendChild(rightDiv);

  const saveBtn = document.createElement('button');
  saveBtn.innerHTML = 'Take a snapshot';
  saveBtn.onclick = printSvg;
  saveBtn.classList.add('pure-button');
  saveBtn.classList.add('pure-button-primary');
  saveBtn.classList.add('button-rounded');
  leftDiv.appendChild(saveBtn);

  const downloadLink = document.createElement('a');
  downloadLink.id = 'download-link';
  downloadLink.title = 'Download SVG';
  const downloadBtn = document.createElement('button');
  downloadBtn.id = 'download-button';
  downloadBtn.innerHTML = 'Download Snapshot';
  downloadBtn.classList.add('pure-button');
  downloadBtn.classList.add('pure-button-primary');
  downloadBtn.classList.add('pure-button-disabled');
  downloadBtn.classList.add('button-rounded');
  downloadLink.appendChild(downloadBtn);
  leftDiv.appendChild(downloadLink);

  return mainDiv;
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
