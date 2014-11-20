'use strict';

//Setting up route
angular.module('steps').config(['$stateProvider',
	function($stateProvider) {
		// Steps state routing
		$stateProvider.
		state('normalization', {
			url: '/steps/normalization/:samples',
			templateUrl: 'modules/steps/views/normalization.client.view.html'
		}).
		state('quantification', {
			url: '/steps/quantification/:samples',
			templateUrl: 'modules/steps/views/quantification.client.view.html'
		}).
		state('sample-arrival', {
			url: '/steps/sample-arrival/:samples',
			templateUrl: 'modules/steps/views/sample-arrival.client.view.html'
		});
	}
]);
