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

  body.addEventListener('dragover', activateDrag, false);
  body.addEventListener('dragleave', deactivateDrag, false);
  body.addEventListener('dragend', deactivateDrag, false);
  container.addEventListener('drop', handleDrop, false);

  function activateDrag(event){
    event.preventDefault();
    event.stopPropagation();

    event.dataTransfer.dropEffect = 'copy';
    body.classList.add('drag-active');
  }

  function handleDrop(event){
    event.preventDefault();
    event.stopPropagation();

    var file = event.dataTransfer.files[0] || null;
    var reader = new FileReader();

    if (!file || !file.type.match(/^audio\//)){
      return;
    }

    var audio = document.querySelector('audio');
    audio.src = URL.createObjectURL(file);
    audio.load();

    p = Peaks.init({
      container:    document.getElementById('peaks-container'),
      mediaElement: document.getElementById('peaks-audio')
    });
  }

  function deactivateDrag(event){
    event.preventDefault();
    event.stopPropagation();

    body.classList.remove('drag-active');
  }
});


