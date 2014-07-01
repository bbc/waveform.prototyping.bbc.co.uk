'use strict';

requirejs.config({
  baseUrl: 'bower_components/',
  paths: {
    "peaks": "peaks.js/src/main",
    "waveform-data": "waveform-data/dist/waveform-data.min",
    "EventEmitter": "eventEmitter/EventEmitter"
  }
});

require(['peaks'], function(Peaks){
  var d = window.document;

  var p = Peaks.init({
    /** REQUIRED OPTIONS **/
    container: document.getElementById('peaks-container'), // Containing element
    mediaElement: document.getElementById('peaks-audio'), // HTML5 Audio element for audio track
    dataUri: {
      arraybuffer: 'data/sample.dat'
    },

    /** Optional config with defaults **/
    height: 200, // height of the waveform canvases in pixels
    zoomLevels: [512, 1024, 2048, 4096], // Array of zoom levels in samples per pixel (big >> small)
    keyboard: false, // Bind keyboard controls
    nudgeIncrement: 0.01, // Keyboard nudge increment in seconds (left arrow/right arrow)
    inMarkerColor: '#a0a0a0', // Colour for the in marker of segments
    outMarkerColor: '#a0a0a0', // Colour for the out marker of segments
    zoomWaveformColor: 'rgba(0, 225, 128, 1)', // Colour for the zoomed in waveform
    overviewWaveformColor: 'rgba(0,0,0,0.2)', // Colour for the overview waveform
    segmentColor: '#0993e3', // Colour for segments on the waveform
    randomizeSegmentColor: true, // Random colour per segment (overrides segmentColor)

    segments: [{
      startTime: 16.5,
      endTime: 20.8,
      color: "#0993e3",
      labelText: "That was't very good to see."
    }]
  });

  d.getElementById("zoomIn").addEventListener("click", p.zoom.zoomIn.bind(p));
  d.getElementById("zoomOut").addEventListener("click", p.zoom.zoomOut.bind(p));
  d.getElementById("add-segment").addEventListener("click", function () {
    p.segments.add(p.time.getCurrentTime(), p.time.getCurrentTime() + 10, true);
  });
  d.getElementById("add-point").addEventListener("click", function () {
    p.points.add(p.time.getCurrentTime(), true);
  });

  /*
  Drag 'n drop your own files
   */
  var body = d.querySelector('body');
  var container = d.querySelector('[data-droppable]');
  var uploadr = d.querySelector('[data-uploadable]');

  body.addEventListener('dragover', setElementState(body, 'drag-active', true));
  body.addEventListener('dragleave', setElementState(body, 'drag-active', false));
  body.addEventListener('dragend', setElementState(body, 'drag-active', false));
  container.addEventListener('drop', handleDrop);
  container.addEventListener('dragover', setElementState(container, 'drop-active', true));
  container.addEventListener('dragover', setElementState(container, 'drop-success', false));
  container.addEventListener('drop', setElementState(container, 'drop-active', false));
  container.addEventListener('dragend', setElementState(container, 'drop-active', false));
  container.addEventListener('dragleave', setElementState(container, 'drop-active', false));
  uploadr.addEventListener('change', handleFileUpload);

  function setElementState(el, stateName, stateValue){
    stateValue = typeof stateValue === 'boolean' ? stateValue : true;

    return function stateHandler(event){
      event.preventDefault();
      event.stopPropagation();

      el.classList[stateValue ? 'add' : 'remove'](stateName);
    };
  }

  function handleDrop(event){
    event.preventDefault();
    event.stopPropagation();

    var file = event.dataTransfer.files[0] || null;

    if (updateWaveformFromFile(file)){
      setElementState(container, 'drop-success', true)(event);
    }
  }

  function handleFileUpload(event){
    Array.prototype.some.call(event.target.files, updateWaveformFromFile);
  }

  function updateWaveformFromFile(file){
    if (!file || !file.type.match(/^audio\//)){
      return false;
    }

    window.location.hash = 'generating-waveform';
    var audio = document.querySelector('audio');
    audio.src = URL.createObjectURL(file);
    audio.load();

    p = Peaks.init({
      container:    document.getElementById('peaks-container'),
      mediaElement: document.getElementById('peaks-audio')
    });

    p.on('segments.ready', function(){
      window.location.hash = 'waveform';
      container.classList.remove('drop-success');
    });

    return true;
  }
});


