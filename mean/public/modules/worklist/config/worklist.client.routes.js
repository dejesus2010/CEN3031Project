'use strict';

//Setting up route
angular.module('worklist').config(['$stateProvider',
	function($stateProvider) {
		// Worklist state routing
		$stateProvider.
		state('worklistclientroutesjs', {
			url: '/worklist',
			templateUrl: 'modules/worklist/views/worklist.client.view.html'
		});
	}
]);