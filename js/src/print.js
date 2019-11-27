export default function printSvg() {
  let canvas = document.getElementsByClassName('visualization-container')[0];
  let serializer = new XMLSerializer();
  let source = serializer.serializeToString(canvas);

  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
  let downloadLink = document.getElementById('download-link');
  let downloadBtn = document.getElementById('download-button');
  downloadLink.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
  downloadBtn.classList.remove('pure-button-disabled');
  downloadLink.download = "visual.svg";
}
