'use strict';

angular.module('steps').controller('StepsController', ['$scope', '$stateParams', '$http', '$location', 'Plates', '$timeout', 'ngDialog', 'worklistFactory',
	function($scope, $stateParams, $http, $location, Plates, $timeout, ngDialog, worklistFactory) {

		for (var i in $scope.plates) {
			$scope.numberOfSamples += $scope.plates[i].samples.length;
		}

		$scope.plates = JSON.parse($stateParams.samples);
		$scope.count = 0;
		$scope.numberOfSamples = 0;

		//////////////////////////////
		// Used for dialog purposes //
		//////////////////////////////
		$scope.grayOut = false;
		$scope.popUpSubHeading = 'Would you like to unassign plates?';
		$scope.popUpConfirmButtonText = 'Yes';
		$scope.popUpCloseButtonText = 'No';

		$scope.closeDialog = function() {
			ngDialog.closeAll();
			$scope.incrementPlates(false);
		};

		$scope.confirmDialog = function(){
			ngDialog.closeAll();
			$scope.incrementPlates(true);
		};
		//////////////////////////////


		$scope.incrementPlates = function(unassignPlates) {

			async.each($scope.plates, function(plate, callback){ // jshint ignore:line
				incrementPlate(plate, function(err){
					if(err){
						console.log(err);
						callback();
					}
					else if(unassignPlates){
						unAssignPlate(plate, function(err){
							if(err){
								console.log(err);
							}
							else{
								$scope.$emit('workListUpdated');
							}
							callback();
						});
					}
					else{
						callback();
					}

				});

			}, function(err){
				returnToWorklist();
			});

		};

		var incrementPlate = function(plate, callback) {

			$http.post('plates/increment/', plate).success(function(){
				var error = false;
				callback(error);
			}).error(function(err){
				callback(err.message);
			});

		};

		var unAssignPlate = function(plate, callback){

			worklistFactory.removePlateFromWorkList(plate, function(err) {
				if (err) {
					callback(err);
				}
				else {
					callback();
				}
			});

		};

		var returnToWorklist = function() {
			$location.path('worklist');
		};

		$scope.$on('ngDialog.closing', function(e, $dialog){

			if(!$scope.$$phase){
				$scope.grayOut = false;
				$scope.$apply();
			}

		});

	}

]);
