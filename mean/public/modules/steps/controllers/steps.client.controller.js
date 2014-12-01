'use strict';

angular.module('steps').controller('StepsController', ['$scope', '$stateParams', '$http', 'Plates',
	function($scope, $stateParams, $http, Plates) {
		// Controller Logic
		// ...
		$scope.plates = JSON.parse($stateParams.samples);

		// used for debugging purposes. Allowed me to see if the selected plates were sent to the page
		/*for(var i = 0; i < $scope.plates.length; i++){
			console.log($scope.plates[i].plateCode);
		}*/

		$scope.incrementPlates = function() {
			for (var i in $scope.plates) {
				var plate = $scope.plates[i];
				$http.post('plates/increment/' + plate._id, plate);
				$http.post('/plates/unassignPlate', plate);
			}
		};

	}


	
]);
