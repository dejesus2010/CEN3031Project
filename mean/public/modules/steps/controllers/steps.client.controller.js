'use strict';

angular.module('steps').controller('StepsController', ['$scope', '$stateParams', '$http', '$location', 'Plates',
	function($scope, $stateParams, $http, $location, Plates) {
		// Controller Logic
		// ...
		$scope.plates = JSON.parse($stateParams.samples);
		$scope.removeFromWorklist = true;

		$scope.incrementPlates = function() {
			async.each($scope.plates, $scope.incrementPlate, function(err) { // jshint ignore:line
				if (err) {
					console.log(err);	
				}
			
			}); 
		};

		$scope.incrementPlate = function(plate) {
			var emission = function() {
				$scope.$emit('workListUpdated');
			};
			$http.post('plates/increment/', plate);
			if ($scope.removeFromWorklist) {
				$http.post('plates/unassignPlate', plate).then(emission);
			}
		};

		$scope.returnToWorklist = function() {
			$location.path('worklist');
		};

	}


	
]);
