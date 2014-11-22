'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', '$http', 'Authentication', 'Menus',
	function($scope, $rootScope, $http, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.init = function(){
			getNumberOfPlatesAssignedTouser();
		};

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		// a plate has been added or deleted from the work list
		$rootScope.$on('workListUpdated', function(event){
			getNumberOfPlatesAssignedTouser();
		});

		var getNumberOfPlatesAssignedTouser = function(){
			$http.get('/numberOfPlatesAssignedToUser').success( function(size){
				$scope.sizeOfWorklist = size;
			});
		};
	}
]);
