export default function printSvg() {
  let canvas = document.getElementById('visualization-canvas');
  let serializer = new XMLSerializer();
  let source = serializer.serializeToString(canvas);

  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
  let downloadLink = document.getElementById('menu-download-link');
  downloadLink.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
  downloadLink.classList.remove('pure-menu-disabled');
  downloadLink.download = "visual.svg";
}