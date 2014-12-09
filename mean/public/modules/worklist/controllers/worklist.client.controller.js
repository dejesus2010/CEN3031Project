'use strict';

angular.module('worklist').controller('WorklistController', ['$scope', '$http', '$location', 'worklistFactory',
	function($scope, $http, $location, worklistFactory){


		// This array is to group plates into stages.
		$scope.groupOfPlates = [15];

		$scope.stageNumberToName = ['N/A', 'Sample Arrival', 'DNA Quantification', 'DNA Normalization', 'DNA Shearing',
		                            'End Repair & Phosphorylation', 'Adenylation', 'Adaptor Ligation', 'Size Selection',
		                            'PCR Enrichment', 'PCR Reaction Cleanup', 'Library Quantification', 'Sample Pooling',
		                            'Hybridization', 'Sequencing'];
		$scope.stageNumberToUrl = ['/', '/steps/sample-arrival', '/steps/dna-quantification', '/steps/normalization',
		                           '/steps/shearing','/steps/end-repair', '/steps/adenylation', '/steps/ligation',
		                           '/steps/size-selection', '/steps/pcr-enrichment', '/steps/pcr-cleanup',
		                           '/steps/library-quantification', '/steps/pooling', '/steps/hybridization',
		                           '/steps/sequencing'];

		$scope.platesExist = true;

		// retrieves plates and saves the plates into groups in the groupOfPlates array
		$scope.init = function(){
			initializeGroupOfPlates();

			$http.get('/plates/userPlates').success(function(plates){
				$scope.plates = plates;
				if($scope.plates.length < 1){
					console.log('Received no plates');
					$scope.platesExist = false;
					return;
				}
				else{
					$scope.platesExist = true;
					separatePlatesIntoGroups(plates);
				}
			});
		};

		var initializeGroupOfPlates = function(){
			for(var i = 0; i < 15; i++){
				$scope.groupOfPlates[i] = [];
			}
		};

		var separatePlatesIntoGroups = function(plates){
			for(var i = 0; i < plates.length; i++){
				var currentPlate = plates[i];
				$scope.groupOfPlates[currentPlate.stage].push(currentPlate);
			}
		};

		$scope.removePlates = function(stagePlates, selectedPlates){
			async.each(selectedPlates, function(plate, callback){ // jshint ignore:line

				removePlate(plate, stagePlates, selectedPlates, function(err){
					if(err){
						console.log(err.message);
					}
					callback();
				});

			}, function(err){
				if(err){
					console.log(err);
				}
			});
		};

		$scope.remove = function(plate, stagePlates, selectedPlates){

			removePlate(plate, stagePlates, selectedPlates, function(err){
				if(err){
					console.log(err.message);
				}
			});

		};

		var removePlate = function(plate, stagePlates, selectedPlates, callback){
			worklistFactory.removePlateFromWorkList(plate, function(err) {
				if (err) {
					callback(err);
				}
				else {

					removePlateFromArray(plate, stagePlates);
					removePlateFromArray(plate, selectedPlates);

					$scope.$emit('workListUpdated');

					callback();
				}
			});
		};

		var removePlateFromArray = function(plate, array){
			var indexOfPlateInArray = array.indexOf(plate);
			array.splice(indexOfPlateInArray, 1);
		};

		// Function call for directing the user to the stage's step page
		$scope.directToPage = function(url, selectedPlates){
			$location.path(url + '/' + JSON.stringify(selectedPlates));
		};

	}]);
