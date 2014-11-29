'use strict';

angular.module('worklist').directive('myWorklistSelected', [
		function(){
			return{
				restrict: 'A',
				link: function postLink(scope, element, attrs){
					// false == have not selected all plates
					// true == selected all plates
					scope.selectedAllPlates = false;
					// creating an empty array which will hold the plate objects that are selected in a stage
					scope.selectedPlates = [];

					scope.selectAll = function(plates){
						scope.selectedAllPlates = !scope.selectedAllPlates;
						scope.selectedPlates = [];
						// Can't simply set scope.selectedPlates = plates, because the next time we unselect
						// a plate i.e removing the plate from scope.selectedPlates, it's as if we are removing
						// from the plate array that was passed as an argument which references stagePlates.
						// Modifying stagePlates will remove the plate's row from the table, because of two way data
						// binding
						if(scope.selectedAllPlates){
							plates.forEach(function(plate){
								scope.selectedPlates.push(plate);
							});
						}

						scope.$broadcast('selectedAll', scope.selectedAllPlates);
					};
				}
			};
		}
	])
.directive('myWorklistPlate', [
	function() {
		// user selected a plate in their worklist... check to see if the plate has been selected
		// before. If the plate has already been selected, remove it from the selected plates, because the
		// user is deselecting the plate. If it hasn't, add it to the selected plates
		var selectPlate = function(selectedPlates, plateToAdd){
			var IndexOfPlateInSelectedPlates = indexInselectedPlates(selectedPlates, plateToAdd);

			if(IndexOfPlateInSelectedPlates === -1){
				selectedPlates.push(plateToAdd);
			}
			else{
				selectedPlates.splice(IndexOfPlateInSelectedPlates, 1);
			}
		};

		var indexInselectedPlates = function(selectedPlates, plate){
			var result = -1;

			for(var i = 0; i < selectedPlates.length; i++){
				if(selectedPlates[i] === plate){
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
				selectedPlates: '=mySelectedPlates',
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
							selectPlate(scope.selectedPlates, scope.plate);
						};

						scope.clickCheckBox = function(){
							selectPlate(scope.selectedPlates, scope.plate);
						};

						scope.$on('selectedAll', function(event, selectedAllPlates){
							scope.plateChecked = selectedAllPlates;
						});

					}
				};
			},
		};
	}
]);
