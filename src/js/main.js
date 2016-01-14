'use strict';

var globeIframe = require('globe-iframe-resizer');

// This fires when the parent of iframe resizes
function onPymParentResize(width) {};
globeIframe(onPymParentResize);
