'use strict';

// Configuring the Plates module
angular.module('plates', ['worklist']).run(['Menus',
  function(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Plates', 'plates/listPlates');
  }
]);
