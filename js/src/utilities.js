import * as d3 from 'd3';

export function getCanvasDimensions(svg) {
  let svgDimensions = {
    width: 800,
    height: 600
  };
  if (getCanvas(svg) !== null) {
    return _.pick(svg.getBoundingClientRect(), 'height', 'width');
  }
  return svgDimensions;
}

export function clearCanvas()
{
  d3.selectAll("svg > *").remove();
}

function getCanvas(svg) {
  if (!_.isObject(svg)) {
    svg = document.getElementById('visualization-canvas');

  }
  return svg;
}