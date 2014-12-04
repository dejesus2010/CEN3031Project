'use strict';

angular.module('steps').controller('StepsController', ['$scope', '$stateParams', '$http', '$location', 'Plates', '$timeout',
	function($scope, $stateParams, $http, $location, Plates, $timeout) {
		// Controller Logic
		// ...
		$scope.plates = JSON.parse($stateParams.samples);
		$scope.removeFromWorklist = true;
		$scope.count = 0;

		$scope.incrementPlates = function() {
			var incCount = function() {
				$scope.count++;
			};
			for(var i in $scope.plates) {
				var plate = $scope.plates[i];
				$scope.incrementPlate(plate, incCount);
			}
			$scope.waitFor($scope.count, $scope.plates.length, $scope.returnToWorklist);
		};

		$scope.waitFor = function(testValue, expectedValue, callback) {
		    // Check if condition met. If not, re-check later (msec).
		    // Found on Stack Overflow, very useful.
		    if (testValue !== expectedValue) {
			    $timeout($scope.waitFor(testValue, expectedValue, callback), 50);
		    }
		    callback();
		};

		$scope.incrementPlate = function(plate, callback) {
			$http.post('plates/increment/', plate);
			if ($scope.removeFromWorklist) {
				$http.post('plates/unassignPlate', plate).then(callback());
			}
			else {
				callback();
			}
		};

		$scope.returnToWorklist = function() {
			$timeout(function() {
				$scope.$emit('workListUpdated');
				$location.path('worklist');
			}, 400);

		};

	}


	
]);
