'use strict';

angular.module('worklist').controller('WorklistController', ['$scope', '$http', '$location', 'worklistFactory',
	function($scope, $http, $location, worklistFactory){


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

        $scope.removePlate = function(plate, plates){

	        worklistFactory.removePlateFromWorkList(plate, function(err){
		        if(err){
			        console.log(err);
		        }
		        else{
			        $scope.$emit('workListUpdated');

			        var indexOfPlateInPlates = -1;
			        for(var i = 0; i < plates.length; i++){
				        if(plates[i] === plate){
					        indexOfPlateInPlates = i;
					        break;
				        }
			        }
			        plates.splice(indexOfPlateInPlates, 1);
		        }
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
