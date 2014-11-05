'use strict';

//Plates service used for communicating with the plates REST endpoints
angular.module('plates').factory('Plates', ['$resource',
	function($resource) {
		return $resource('plates/:plateId', {
			plateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);