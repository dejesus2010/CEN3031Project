'use strict';

angular.module('plates').controller('IndividualPlateController', ['$scope', '$http', '$stateParams', '$location', '$window', 'Authentication', 'Plates', 'Projects',
  function($scope, $http, $stateParams, $location, $window, Authentication, Plates, Projects) {
    $scope.authentication = Authentication;
    $scope.project = {};

    $scope.plate = Plates.get({plateId: $stateParams.plateId},
    		function(err, res) {
    			$scope.project = Projects.get({projectId: $scope.plate.project._id});
		    });

    $scope.decrementPlate = function(plate, callback) {
    	$http.post('plates/decrement/', plate).success(function() {
    		var error = false;
    		$http.put('plates/' + plate._id).success(function() {
    			$window.location.reload();
    		});
    		if (callback) {
			    callback(error);
    		}
    	}).error(function(err) {
    		console.log(err);
    	});

    };
}]);
