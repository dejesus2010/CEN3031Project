'use strict';

//Setting up route
angular.module('species').config(['$stateProvider',
	function($stateProvider) {
		// Species state routing
		$stateProvider.
		state('species', {
			url: '/species',
			templateUrl: 'modules/species/views/species.client.view.html'
		}).
		state('createSpecie', {
			url: '/species/create',
			templateUrl: 'modules/species/views/create-specie.client.view.html'
		});
	}
]);