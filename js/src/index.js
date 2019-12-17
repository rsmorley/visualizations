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

  const visMenuItems = new Array();
  visMenuItems.push(
    {
      listItemClasses: new Array('pure-menu-selected'),
      id: 'menu-circle-link',
      text: 'Circle Walk'
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
 *  text: text displayed for menu item - required 
 *  click: onclick function - optional
 *  linkClasses: array of classes to add to href - optional
 *  listItemClasses: array of classes to add to li- optional
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
