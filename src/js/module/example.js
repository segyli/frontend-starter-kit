// this serves as an template for writing modules

var App = App || {};

App.ModuleName = (function(global, Vue) {

  // vue.js component options
  var moduleNameOpt = {
    el: '#IDName',
    data: {
      // you are here to define component states and other stuff

    },
    methods: {
      // you are here to define component actions like event handlers

    },
    watch: {

    },
    ready: function() {

    }
  };

  function init() {
    // new a vue.js component
    moduleNameVM = new Vue(moduleNameOpt);
  }

  return {
    init: init
  };

  // put variables to bottoms
  var varName,
      moduleNameVM;

})(window, Vue);
