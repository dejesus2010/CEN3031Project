'use strict';

//Setting up route
angular.module('plates').config(['$stateProvider',
	function($stateProvider) {
		// Plates state routing
		$stateProvider.
    state('listPlates', {
      url: '/plates/listPlates',
      templateUrl: 'modules/plates/views/list-plates.client.view.html'
    }).
  	state('viewPlate', {
      url: '/plates/:plateId',
      templateUrl: 'modules/plates/views/plates.client.view.html'
    });
	}
]);