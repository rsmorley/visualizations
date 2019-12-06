import 'babel-polyfill';
import * as d3 from 'd3';
import _ from 'lodash';

import * as constants from './constants.js';
import printSvg from './print.js';
import { clearCanvas, getCanvasDimensions } from './utilities.js';
import './style.css';

function component() {
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('page-body');
  mainDiv.appendChild(createMenu());
  document.body.appendChild(mainDiv);

  // create svg container
  let svgContainer = d3.select('.page-body').append('svg')
    .attr('id', 'visualization-canvas')
    .attr('class', 'visualization-canvas');

  let svg = document.getElementById('visualization-canvas');
  let {width, height} = getCanvasDimensions(svg);

  mainDiv.appendChild(createButtons());
  
  drawWalkingCirclesWithVaryingDiameters(svgContainer, width/2, height/2, 0, 1);
}

function createMenu() {
  const menuContainer = document.createElement('div');
  menuContainer.classList.add('menu');
  
  const menuDiv = document.createElement('div');
  menuDiv.classList.add('pure-menu');

  const menuHeading1 = document.createElement('span');
  menuHeading1.innerHTML = 'Visualizations';
  menuHeading1.classList.add('pure-menu-heading');
  menuDiv.appendChild(menuHeading1);

  const menuList1 = document.createElement('ul');
  menuList1.classList.add('pure-menu-list');

  const menuItem1 = document.createElement('li');
  menuItem1.classList.add('pure-menu-item');

  const menuLink1 = document.createElement('a');
  menuLink1.innerHTML = 'Circle Walk';
  menuLink1.classList.add('pure-menu-link');

  menuItem1.appendChild(menuLink1);
  menuList1.appendChild(menuItem1);
  menuDiv.appendChild(menuList1);

  const menuHeading2 = document.createElement('span');
  menuHeading2.innerHTML = 'Actions';
  menuHeading2.classList.add('pure-menu-heading');
  menuDiv.appendChild(menuHeading2);

  const menuList2 = document.createElement('ul');
  menuList2.classList.add('pure-menu-list');

  const menuItem2 = document.createElement('li');
  menuItem2.classList.add('pure-menu-item');
  
  const menuLink2 = document.createElement('a');
  menuLink2.innerHTML = 'Take Snapshot';
  menuLink2.classList.add('pure-menu-link');

  menuItem2.appendChild(menuLink2);
  menuList2.appendChild(menuItem2);
  menuDiv.appendChild(menuList2);

  menuContainer.appendChild(menuDiv);

  return menuContainer;
}

function createButtons() {
  // create buttons
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

  // create a button with a link wrapper to we can download the svg file
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

  const clearBtn = document.createElement('button');
  clearBtn.innerHTML = 'Clear Canvas';
  clearBtn.id = 'clear-button';
  clearBtn.onclick = clearCanvas;
  clearBtn.classList.add('pure-button');
  clearBtn.classList.add('pure-button-primary');
  clearBtn.classList.add('button-rounded');
  leftDiv.appendChild(clearBtn);

  return mainDiv;
}

function drawWalkingCirclesWithVaryingDiameters(svgContainer, xCoord, yCoord, colorIndex, frameCount) {

  let svg = document.getElementById('visualization-canvas');
  let {width, height} = getCanvasDimensions(svg);
  let maxRadius = width/10;
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
  xCoord = Math.max(0, Math.min(xCoord, width));
  yCoord = Math.max(0, Math.min(yCoord, height));
  d3.timeout(
    drawWalkingCirclesWithVaryingDiameters.bind(null,
      svgContainer,
      xCoord,
      yCoord,
      ++colorIndex % 5,
      ++frameCount
    ), constants.drawDelay);

  if (frameCount % 150 == 0) {
    clearCanvas();
  }
}

component();
