'use strict';

//Setting up route
angular.module('customers').config(['$stateProvider',
	function($stateProvider) {
		// Customers state routing
		$stateProvider.
		state('customers', {
			url: '/customers',
			templateUrl: 'modules/customers/views/customers.client.view.html'
		});
	}
]);