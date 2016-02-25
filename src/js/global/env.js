var App = App || {};

App.ENV = (function(global, Vue) {
  var html = document.documentElement,
      body = document.body,
      isLoggedIn = !html.classList.contains('not-logged-in');

  return {
    isLoggedIn: isLoggedIn
  };

})(window, Vue);
