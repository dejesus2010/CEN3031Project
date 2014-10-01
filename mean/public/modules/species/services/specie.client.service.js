'use strict';

//Species service used for communicating with the species REST endpoints
angular.module('species').factory('Species', ['$resource',
	function($resource) {
		return $resource('species/:specieId', {
			specieId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);