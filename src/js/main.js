// Firing off everything.

$(document).ready(function($) {
  var html = document.documentElement,
      body = document.body,
      controller = body.getAttribute('data-controller'),
      action = body.getAttribute('data-action'),
      isLoggedIn = !html.classList.contains('not-logged-in');


  if (isLoggedIn) {
    // stuff need to be inited when logged in
  }

  // init stuff when user is not logged in

  // this is an example of how to use controller and action variables
  if (controller === 'list') {
    // App.List.init();

    if (action === 'hottest') {
      // App.ListHottest.init();
    }
  }
});
