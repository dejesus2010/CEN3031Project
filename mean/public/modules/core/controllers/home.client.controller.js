'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.clicked = function(){
			if($scope.authentication.user){
				$location.path('/projects');
			}
			else{
				$location.path('/signin');
			}
		};
	}
]);
