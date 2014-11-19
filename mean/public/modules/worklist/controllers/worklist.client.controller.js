'use strict';

angular.module('worklist').controller('WorklistController', ['$scope', '$http', 'Plates',
	function($scope, $http, Plates){

		$scope.platesReady = false;

		$scope.groupOfPlates = [14];

		$scope.init = function(){
			$http.get('http://localhost:3000/plates/userPlates').success(function(plates){
				$scope.plates = plates;
			});
		};

		var initializeGroupOfPlates = function(){
			for(i = 0; i < 14; i++){
				$scope.groupOfPlates[i] = new Array();
			}
		};

		var separatePlatesIntoGroups = function(plates){

		}
	}]);
