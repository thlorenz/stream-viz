'use strict';


/**
 * Adds a range input that allows to adjust the throttle of the given stream.
 * 
 * @name exports
 * @function
 * @param el {DOMElement} to attach the throttle range to 
 *  - expected to have child with class 'throttle' and another with class 'throttle-value'
 * @param stream {Stream} whose throttle value should be adjusted
 */
module.exports = function addThrottleRange(el, stream) {
  var range = el.getElementsByClassName('throttle')[0];
  var rangeValue = el.getElementsByClassName('throttle-value')[0];
  range.onchange = onvalueChanged;
  range.min = 0;
  range.max = 2000;
  range.step = 100;
  range.value = stream.throttle;
  rangeValue.innerHTML = stream.throttle;
  window.range = range;

  function onvalueChanged (ev) {
    var range = ev.srcElement;
    rangeValue.innerHTML = range.value;
    stream.throttle = range.valueAsNumber;
  }
}
