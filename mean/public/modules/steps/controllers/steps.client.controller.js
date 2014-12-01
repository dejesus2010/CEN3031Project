'use strict';

angular.module('steps').controller('StepsController', ['$scope', '$stateParams', '$http', 'Plates',
	function($scope, $stateParams, $http, Plates) {
		// Controller Logic
		// ...
		$scope.plates = JSON.parse($stateParams.samples);

		$scope.incrementPlates = function() {
			var emission = function() {
				$scope.$emit('workListUpdated');
			};
			for (var i in $scope.plates) {
				var plate = $scope.plates[i];
				$http.post('plates/increment/' + plate._id, plate);
				$http.post('/plates/unassignPlate', plate).success(emission);
			}
		};

	}


	
]);
