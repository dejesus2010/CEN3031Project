'use strict';

angular.module('worklist').directive('myWorklistStage', ['$location',
		function($location){
			// Function call for directing the user to the stage's step page
			var directToStagePage = function(url, stageSelectedPlates){
				$location.path(url + '/' + JSON.stringify(stageSelectedPlates));
			};

			return{
				restrict: 'A',
				link: function postLink(scope, element, attrs){
					// creating an empty array which will hold the plate objects that are selected
					scope.stageSelectedPlates = [];
					scope.directToStagePage = directToStagePage;
				}
			};
		}
	])
.directive('myWorklistPlate', [
	function() {
		// user selected a plate in their worklist... check to see if the plate has been selected
		// before. If the plate has already been selected, remove it from the selected plates, because the
		// user is deselecting the plate. If it hasn't, add it to the selected plates
		var selectPlate = function(stageSelectedPlates, plateToAdd){
			var IndexOfPlateInSelectedPlates = indexInStageSelectedPlates(stageSelectedPlates, plateToAdd);

			if(IndexOfPlateInSelectedPlates === -1){
				stageSelectedPlates.push(plateToAdd);
			}
			else{
				stageSelectedPlates.splice(IndexOfPlateInSelectedPlates, 1);
			}
		};

		var indexInStageSelectedPlates = function(stageSelectedPlates, plate){
			var result = -1;

			for(var i = 0; i < stageSelectedPlates.length; i++){
				if(stageSelectedPlates[i] === plate){
					result = i;
					break;
				}
			}

			return result;
		};

		return {
			restrict: 'A',
			scope: {
				plate: '=myPlateObject',
				stageSelectedPlates: '=myStageSelectedPlates',
				plateChecked: '=myPlateChecked',
				clickNotOnCheckBox: '=myClickedNotOnCheckbox',
				clickCheckBox: '=myClickedCheckbox'
			},
			compile: function(tElem, tAttrs){
				return{
					pre: function (scope,element,attrs){

					},
					post: function (scope, element, attrs) {

						scope.clickNotOnCheckBox = function(){
							scope.plateChecked = !scope.plateChecked;
							selectPlate(scope.stageSelectedPlates, scope.plate);
						};

						scope.clickCheckBox = function(){
							selectPlate(scope.stageSelectedPlates, scope.plate);
						};

					}
				};
			},
		};
	}
]);
