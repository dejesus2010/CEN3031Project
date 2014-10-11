'use strict';

angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'Customers', 'Species',
	function($scope, $stateParams, $location, Authentication, Projects, Customers, Species) {

		$scope.authentication = Authentication;
		$scope.customers = Customers.query();
		$scope.species = Species.query();

		$scope.customer = {};
		$scope.specie = {};

		$scope.create = function() {
			var project = new Projects({
				projectCode: this.projectCode,
				description: this.description,
				customer: $scope.customer.selected._id,
				species: $scope.specie.selected._id,
				due: this.due
			});
			project.$save(function(response) {
				$location.path('projects/' + response._id);

				$scope.projectCode= '';
				$scope.description = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(project) {
			if (project) {
				project.$remove();

				for (var i in $scope.projects) {
					if ($scope.projects[i] === project) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		$scope.update = function() {
			var project = $scope.project;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		$scope.findOne = function() {
			$scope.project = Projects.get({
				projectId: $stateParams.projectId
			});
		};

		///////////////////////////////
		// date picker control logic //
		///////////////////////////////
		$scope.today = function() {
				$scope.dt = new Date();
		};

		$scope.today();

		$scope.clear = function () {
				$scope.due = null;
		};

		$scope.toggleMin = function() {
				$scope.minDate = $scope.minDate ? null : new Date();
		};
		$scope.toggleMin();

		$scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();

				$scope.opened = true;
		};

		$scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
	}
]);
