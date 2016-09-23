'use strict';

module.exports = /*  @ngInject */
  function scrollService() {

    var service = {
      disableScroll: disableScroll,
      enableScroll: enableScroll
    };

    var keys = {37: 1, 38: 1, 39: 1, 40: 1};

    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
      if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
    }

    return service;

    /**
     * @name disableScroll
     * @desc Disable scroll on entire page
     * @memberOf cf.common.services
    */
    function disableScroll() {
      if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', preventDefault, false);
      }
      window.onwheel = preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove  = preventDefault; // mobile
      document.onkeydown  = preventDefaultForScrollKeys;
    }

    /**
     * @name enableScroll
     * @desc Enable scroll on entire page
     * @memberOf cf.common.services
    */
    function enableScroll() {
      if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
      }
      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
    }
  };
