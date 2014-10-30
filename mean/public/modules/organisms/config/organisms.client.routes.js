'use strict';

//Setting up route
angular.module('organisms').config(['$stateProvider',
	function($stateProvider) {
		// Organisms state routing
		$stateProvider.
		state('organisms', {
			url: '/organisms',
			templateUrl: 'modules/organisms/views/organisms.client.view.html'
		}).
		state('createOrganism', {
			url: '/organisms/create',
			templateUrl: 'modules/organisms/views/create-organism.client.view.html'
		});
	}
]);