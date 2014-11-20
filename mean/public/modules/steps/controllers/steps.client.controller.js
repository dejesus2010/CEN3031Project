'use strict';

angular.module('steps').controller('StepsController', ['$scope', '$stateParams',
	function($scope, $stateParams) {
		// Controller Logic
		// ...
		$scope.plates = JSON.parse($stateParams.samples);

		// used for debugging purposes. Allowed me to see if the selected plates were sent to the page
		for(var i = 0; i < $scope.plates.length; i++){
			console.log($scope.plates[i].plateCode);
		}
	}
]);
