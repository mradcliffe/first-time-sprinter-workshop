
import Reveal from 'reveal.js/js/reveal';
import markdown from './plugin/markdown';

require('reveal.js/css/reveal.scss');
require('reveal.js/css/theme/black.css');
// Printing and PDF exports.
require('reveal.js/css/print/paper.css');
require('../sass/style.scss');

// Plugins need to be initialized before reveal.js is initialized because.
markdown.initialize();

// Full list of configuration options available at:
// https://github.com/hakimel/reveal.js#configuration
Reveal.initialize({
  width: 1280,
  height: 720,
  controls: false,
  progress: false,
  history: true,
  center: true,
  // Options: none/fade/slide/convex/concave/zoom.
  transition: 'none',
  // Optional reveal.js plugins.
  dependencies: [],
});

Reveal.addEventListener('slidechanged', (event) => {
  // event.previousSlide, event.currentSlide, event.indexh, event.indexv
  const attribution = document.querySelector('#attribution');
  if (event.currentSlide.dataset.header) {
    attribution.innerHTML = event.currentSlide.dataset.header;
  } else {
    attribution.innerHTML = '';
  }
});
