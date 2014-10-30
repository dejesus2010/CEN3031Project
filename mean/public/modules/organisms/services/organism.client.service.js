'use strict';

//Organisms service used for communicating with the organisms REST endpoints
angular.module('organisms').factory('Organisms', ['$resource',
	function($resource) {
		return $resource('organisms/:organismId', {
			organismId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);