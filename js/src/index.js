import 'babel-polyfill';
import * as d3 from 'd3';
import _ from 'lodash';

import * as constants from './constants.js';
import printSvg from './print.js';
import { clearCanvas, getCanvasDimensions } from './utilities.js';
import './style.css';

let drawMode = constants.VIS_MODE_CIRCLE_WALK;
let drawDelay = 400;
let maxFrames = 1500;


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
      ({xCoord, yCoord} = drawRandomLinesToOrigin(
        xCoord,
        yCoord,
        colorIndex
      ));
      break;
    default:
      ({xCoord, yCoord} = drawWalkingCirclesWithVaryingDiameters(
        xCoord,
        yCoord,
        colorIndex
      ));
      break;
  }

  _.delay(drawFrame, drawDelay, xCoord, yCoord, ++colorIndex % 5, ++frameCount);

  if (frameCount % maxFrames == 0) {
    clearCanvas();
  }
}

function setVisualization(event, mode) {
  let clickedItem = _.get(event, 'target.parentElement', {});
  let otherListItems = _.get(clickedItem, 'parentElement.children', {});
  _.forEach(otherListItems, (listItem) => {
    listItem.classList.remove('pure-menu-selected');
  });
  clickedItem.classList.add('pure-menu-selected');
  
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
      click: (event) => setVisualization(event, constants.VIS_MODE_CIRCLE_WALK),
      id: 'menu-circle-walk-link',
      listItemClasses: new Array('pure-menu-selected'),
      text: 'Circle Walk'
    },
    {
      click: (event) => setVisualization(event, constants.VIS_MODE_RANDOM_LINES),
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
  
  const menuHeading3 = document.createElement('span');
  menuHeading3.innerHTML = 'Config';
  menuHeading3.classList.add('pure-menu-heading');
  menuDiv.appendChild(menuHeading3);

  const configMenuItems = new Array();
  configMenuItems.push(
    {
      listItemClasses: new Array('pure-menu-has-children','pure-menu-allow-hover'),
      id: 'menu-draw-delay-link',
      text: 'Draw Delay',
      children: new Array({
        click: () => {drawDelay = 50;},
        id: 'menu-draw-delay-50-link',
        text: '50'
      },{
        click: () => {drawDelay = 100;},
        id: 'menu-draw-delay-100-link',
        text: '100'
      },{
        click: () => {drawDelay = 200;},
        id: 'menu-draw-delay-100-link',
        text: '200'
      },{
        click: () => {drawDelay = 400;},
        id: 'menu-draw-delay-100-link',
        text: '400'
      },{
        click: () => {drawDelay = 800;},
        id: 'menu-draw-delay-100-link',
        text: '800'
      })
    });
  configMenuItems.push(
    {
      listItemClasses: new Array('pure-menu-has-children','pure-menu-allow-hover'),
      children: new Array({
        click: () => {maxFrames = 250;},
        id: 'menu-max-frames-50-link',
        text: '250'
      },{
        click: () => {maxFrames = 500;},
        id: 'menu-max-frames-100-link',
        text: '500'
      },{
        click: () => {maxFrames = 1000;},
        id: 'menu-max-frames-100-link',
        text: '1000'
      },{
        click: () => {maxFrames = 2000;},
        id: 'menu-max-frames-100-link',
        text: '2000'
      }),
      id: 'menu-max-frames-link',
      text: 'Max Frames'
    });

  menuDiv.appendChild(createMenuItems(configMenuItems));

  menuContainer.appendChild(menuDiv);
  return menuContainer;
}

/**
 * 
 * @param {Array} items array of objects
 * 
 * @return {Object} menuItems
 */
function createMenuItems (items) {

  const menuList = document.createElement('ul');
  menuList.classList.add('pure-menu-list');

  _.forEach(items, (item) => {
    let listItem = createMenuItem(item);
    menuList.appendChild(listItem);
  });

  return menuList;
}

/**
 * 
 * @param {*} item has the following properites
 *  text: text displayed for menu item - required 
 *  click: onclick function - optional
 *  children: submenu items - optional
 *  linkClasses: array of classes to add to href - optional
 *  listItemClasses: array of classes to add to li- optional
 * 
 * @return {Object} listItem containing a link
 */
function createMenuItem(item) {
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
    if (_.isArray(item.children)) {
      const childList = document.createElement('ul');
      childList.classList.add('pure-menu-children');
      _.forEach(item.children, (child) => {
        const childListItem = createMenuItem(child);
        
        childList.appendChild(childListItem);
      });

      listItem.appendChild(childList);
    }
    return listItem;
}

/**
 * 
 * @param {number} xCoord 
 * @param {number} yCoord 
 * @param {number} colorIndex 
 * 
 * @return {Object} xCoord, yCoord
 */
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

/**
 * 
 * @param {number} xCoord 
 * @param {number} yCoord 
 * @param {number} colorIndex 
 * 
 * @return {Object} xCoord, yCoord
 */
function drawRandomLinesToOrigin(xCoord, yCoord, colorIndex) {
  let svg = document.getElementById('visualization-canvas');
  let {width, height} = getCanvasDimensions(svg);
  let xCoordCentroid = width/2;
  let yCoordCentroid = height/2;

  let svgContainer = d3.select('#visualization-canvas');
  // draw a line
  let line = svgContainer.append('line')
    .attr('x1', xCoord)
    .attr('y1', yCoord)
    .attr('x2', xCoordCentroid)
    .attr('y2', yCoordCentroid)
    .style('stroke', _.get(constants, ['eightiesColors', colorIndex]))
    .style('stroke-width', 2);
 
  xCoord = Math.random() * width;
  yCoord = Math.random() * height;
  return {xCoord, yCoord};
}

component();
