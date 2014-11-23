'use strict';

angular.module('worklist').controller('WorklistController', ['$scope', '$http', '$location',
	function($scope, $http, $location){


		// This array is to group plates into stages.
		$scope.groupOfPlates = [15];

		$scope.stageNumberToName = ['N/A', 'Samples Arrive', 'Quantification', 'Normalization'];
		$scope.stageNumberToUrl = ['/', '/steps/sample-arrival', '/steps/quantification', '/steps/normalization'];

		$scope.platesExist = false;

		// retrieves plates and saves the plates into groups in the groupOfPlates array
		$scope.init = function(){
			initializeGroupOfPlates();

			$http.get('/plates/userPlates').success(function(plates){
				$scope.plates = plates;
				if($scope.plates.length < 1){
					console.log('Received no plates');
					return;
				}
				else{
					$scope.platesExist = true;
					separatePlatesIntoGroups(plates);
				}
			});
		};

        $scope.removePlate = function(plate){
            console.log('removed plate');
            $http.post('/plates/unassignPlate', plate).success(function(response) {
                // emit signal that a plate was removed to update Work List plates assigned size in header
                $scope.$emit('workListUpdated');
            }).error(function(err) {
                console.log(err);
                //doesn't exist for this controller. should be remedied later?
                //$scope.error = err.message;
                //$scope.errorDialog();
            });
        };


		var initializeGroupOfPlates = function(){
			for(var i = 0; i < 14; i++){
				$scope.groupOfPlates[i] = [];
			}
		};

		var separatePlatesIntoGroups = function(plates){
			for(var i = 0; i < plates.length; i++){
				var currentPlate = plates[i];
				$scope.groupOfPlates[currentPlate.stage].push(currentPlate);
			}
		};

		// Function call for directing the user to the stage's step page
		$scope.directToPage = function(url, selectedPlates){
			$location.path(url + '/' + JSON.stringify(selectedPlates));
		};


	}]);
