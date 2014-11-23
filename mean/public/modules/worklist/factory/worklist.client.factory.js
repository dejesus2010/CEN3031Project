'use strict';

angular.module('worklist').factory('worklistFactory', ['$http',
	function($http){
		var service = {};

		service.addPlateToWorkList = function(plate, callback) {
			var error = void 0;

			if (plate === null) {
				error = 'No plate is selected';
				callback(error);
			}
			else if (plate.isAssigned) {
				error = 'Plate is already assigned';
				callback(error);
			}
			else {
				$http.post('/plates/assignPlate', plate).success(function(response) {
					error = false; // set to false so if(err) block is not executed
					callback(error);
				}).error(function(err) {
					error = err.message;
					callback(error);
				});
			}
		};

		service.removePlateFromWorkList = function(plate, callback){
			$http.post('/plates/unassignPlate', plate).success(function(response) {
				var error = false;
				callback(error);
			}).error(function(err) {
				callback(err);
			});
		};

		return service;
	}]);
