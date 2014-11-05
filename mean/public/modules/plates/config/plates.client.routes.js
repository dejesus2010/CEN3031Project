'use strict';

//Setting up route
angular.module('plates').config(['$stateProvider',
	function($stateProvider) {
		// Plates state routing
		$stateProvider.
		state('plates', {
			url: '/plates',
			templateUrl: 'modules/plates/views/plates.client.view.html'
		});
	}
]);