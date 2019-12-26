import 'babel-polyfill';
import * as d3 from 'd3';
import _ from 'lodash';

import * as constants from './constants.js';
import printSvg from './print.js';
import { clearCanvas, getCanvasDimensions } from './utilities.js';
import './style.css';

var drawMode = constants.VIS_MODE_CIRCLE_WALK;

function component() {
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('page-body');
  mainDiv.appendChild(createMenu());
  document.body.appendChild(mainDiv);

  // create svg container
  let svgContainer = d3.select('.page-body').append('svg')
    .attr('id', 'visualization-canvas')
    .attr('class', 'visualization-canvas');

    drawFrame();
}

function drawFrame(xCoord, yCoord, colorIndex = 0, frameCount = 0) {
  let svg = document.getElementById('visualization-canvas');
  if (!xCoord) {
    let {width, height} = getCanvasDimensions(svg);
    xCoord = width/2;
    yCoord = height/2;
  }
  switch(drawMode) {
    case constants.VIS_MODE_RANDOM_LINES:
      console.log('not implemented');
      break;
    default:
      ({xCoord, yCoord} = drawWalkingCirclesWithVaryingDiameters(
        xCoord,
        yCoord,
        colorIndex
      ));
  }

  _.delay(drawFrame, constants.drawDelay, xCoord, yCoord, ++colorIndex % 5, ++frameCount);

  if (frameCount % 150 == 0) {
    clearCanvas();
  }
}

function setVisualization(mode) {
  drawMode = mode;
}

/**
 *  This function creates the left hand menu
 * 
 *  @return {div}
 */
function createMenu() {
  const menuContainer = document.createElement('div');
  menuContainer.classList.add('menu');
  
  const menuDiv = document.createElement('div');
  menuDiv.classList.add('pure-menu');

  const menuHeading1 = document.createElement('span');
  menuHeading1.innerHTML = 'Visualizations';
  menuHeading1.classList.add('pure-menu-heading');
  menuDiv.appendChild(menuHeading1);

  const visMenuItems = new Array();
  visMenuItems.push(
    {
      click: _ => setVisualization(constants.VIS_MODE_CIRCLE_WALK),
      id: 'menu-circle-walk-link',
      listItemClasses: new Array('pure-menu-selected'),
      text: 'Circle Walk'
    },
    {
      click: _ => setVisualization(constants.VIS_MODE_RANDOM_LINES),
      id: 'menu-random-lines-link',
      text: 'Random Lines'
    });
  menuDiv.appendChild(createMenuItems(visMenuItems));

  const menuHeading2 = document.createElement('span');
  menuHeading2.innerHTML = 'Actions';
  menuHeading2.classList.add('pure-menu-heading');
  menuDiv.appendChild(menuHeading2);

  const actionMenuItems = new Array();
  actionMenuItems.push(
    {
      listItemClasses: new Array('menu-item-divided'),
      click: printSvg,
      id: 'menu-print-link',
      text: 'Take Snapshot'
    });
  actionMenuItems.push(
    {
      click: clearCanvas,
      id: 'menu-clear-link',
      text: 'Clear Canvas'
    });
  actionMenuItems.push(
    {
      linkClasses: new Array('pure-menu-disabled'),
      id: 'menu-download-link',
      text: 'Download Snapshot'
    });

  menuDiv.appendChild(createMenuItems(actionMenuItems));
  
  menuContainer.appendChild(menuDiv);
  return menuContainer;
}

/**
 * 
 * @param {Array} items array of objects
 *  each item has the following properties
 *  text: text displayed for menu item - required 
 *  click: onclick function - optional
 *  linkClasses: array of classes to add to href - optional
 *  listItemClasses: array of classes to add to li- optional:w
 */
function createMenuItems (items) {

  const menuList = document.createElement('ul');
  menuList.classList.add('pure-menu-list');

  _.forEach(items, (item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('pure-menu-item');
    if (_.isArray(item.listItemClasses)) {
      _.forEach(item.listItemClasses, (className) => {
        listItem.classList.add(className);
      });
    }

    const menuLink = document.createElement('a');
    menuLink.classList.add('pure-menu-link');
    menuLink.innerHTML = item.text;
    if (_.isFunction(item.click)) {
      menuLink.onclick = item.click;
    }
    if (_.isArray(item.linkClasses)) {
      _.forEach(item.linkClasses, (className) => {
        menuLink.classList.add(className);
      });
    }
    menuLink.id = item.id;

    listItem.appendChild(menuLink);
    menuList.appendChild(listItem);
  });

  return menuList;
}

function drawWalkingCirclesWithVaryingDiameters(xCoord, yCoord, colorIndex) {

  let svg = document.getElementById('visualization-canvas');
  let {width, height} = getCanvasDimensions(svg);
  let maxRadius = width/10;
  let minRadius = 10;
  let radius = Math.random() * (maxRadius - minRadius) + minRadius;

  let svgContainer = d3.select('#visualization-canvas');
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

  return {xCoord, yCoord};
}

component();
