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

        $scope.removePlate = function(plate, stagePlates, selectedPlates){

	        worklistFactory.removePlateFromWorkList(plate, function(err){
		        if(err){
			        console.log(err);
		        }
		        else{
			        // Let the header know the worklist has been updated so the size icon can update accordingly
			        $scope.$emit('workListUpdated');

			        // index where the plate occurs in the stage's all
			        // plates array (which is all the plates in the stage on the client side)
			           // removing it from this array makes the plate's row disappear client side
			        var indexOfPlateInStagePlates  = -1;

			        // index where the plate occurs in the stage's
			        // selectedPlates array (which is the array of plates selected in a stage)
			           // removing it from this array will remove it from the selected plates to be sent to perform a stage
			        var indexOfPlateInSelectedPlates = -1;

			        // Going to iterate over both arrays in one shot
			        var maxLengthOfArrays = Math.max(stagePlates.length, selectedPlates.length);

			        for(var i = 0; i < maxLengthOfArrays; i++){

				        if(indexOfPlateInStagePlates  === -1 && i < stagePlates.length && stagePlates[i] === plate){
					        indexOfPlateInStagePlates  = i;
				        }

				        if(indexOfPlateInSelectedPlates === -1 && i < selectedPlates.length && selectedPlates[i] === plate){
					        indexOfPlateInSelectedPlates = i;
				        }

				        if(indexOfPlateInStagePlates  !== -1 && indexOfPlateInSelectedPlates !== -1){
					        break;
				        }
			        }

			        if(indexOfPlateInStagePlates  !== -1){
				        stagePlates.splice(indexOfPlateInStagePlates , 1);
			        }

			        if(indexOfPlateInSelectedPlates !== -1){
				        selectedPlates.splice(indexOfPlateInSelectedPlates, 1);
			        }
		        }
	        });

        };

		// Function call for directing the user to the stage's step page
		$scope.directToPage = function(url, selectedPlates){
			$location.path(url + '/' + JSON.stringify(selectedPlates));
		};


	}]);
