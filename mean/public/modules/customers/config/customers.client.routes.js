'use strict';

//Setting up route
angular.module('customers').config(['$stateProvider',
	function($stateProvider) {
		// Customers state routing
		$stateProvider.
		state('customers', {
			url: '/customers',
			templateUrl: 'modules/customers/views/customers.client.view.html'
		}).
		state('createCustomer', {
			url: '/customers/create',
			templateUrl: 'modules/customers/views/create-customer.client.view.html'
		});
	}
]);