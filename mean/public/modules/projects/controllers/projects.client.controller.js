'use strict';

angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'ngDialog', 'Authentication', 'Projects', 'Customers', 'Organisms',
	function($scope, $stateParams, $location, ngDialog, Authentication, Projects, Customers, Organisms) {

		$scope.authentication = Authentication;
		$scope.customers = Customers.query();
		$scope.organisms = Organisms.query();
		$scope.projects = [];
		$scope.gridReady = false;

		$scope.customer = {};
		$scope.organism = {};

		$scope.create = function() {
			var project = new Projects({
				projectCode: this.projectCode,
				description: this.description,
				customer: $scope.customer.selected._id,
				organism: $scope.organism.selected._id,
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
			$scope.closeDialog();
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

		$scope.confirmRemove = function() {
			ngDialog.open({
				template: 'deleteConfirmDialog',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
		};

		$scope.closeDialog = function() {
			ngDialog.closeAll();
		};

		$scope.update = function() {
			var project = $scope.project;
			project.customer = $scope.selectedCustomer.selected;
			project.organism = $scope.selectedOrganism.selected;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.init = function() {
			$scope.projects = Projects.query(function(err, res) {
				$scope.initReactGrid();
			});
		};

		$scope.findOne = function() {
			$scope.project = Projects.get({
				projectId: $stateParams.projectId
			}, function(err, res) {
				$scope.selectedCustomer = {selected: $scope.project.customer};
				$scope.selectedOrganism = {selected: $scope.project.organism};
				$scope.disabled = true;
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

		$scope.initReactGrid = function() {
				$scope.grid.data = JSON.parse(JSON.stringify($scope.projects));
				for (var project = 0; project < $scope.grid.data.length; ++project) {
					// Make dates and project status human readable
					$scope.grid.data[project].due = new Date(Date.parse($scope.grid.data[project].due)).toISOString().slice(0,10);
					$scope.grid.data[project].projectStatus = $scope.grid.data[project].projectStatus ? 'Completed' : 'In Progress';
				}
				$scope.gridReady = true;
		};

		$scope.grid = {
			data: [],
			rowClick: function(row) {
				$scope.$apply(function() {
					$location.path('projects/' + row._id);
				});
			},
			columnDefs: [{
				field: 'projectCode',
				displayName: 'Project Code',
				width: '7%'
			}, {
				field: 'organism.name',
				displayName: 'Organism',
			}, {
				field: 'customer.name',
				displayName: 'Customer'
			}, {
				field: 'due',
				displayName: 'Due Date',
				width: '6%'
			}, {
				field: 'projectStatus',
				displayName: 'Project Status',
				width: '7%'
			}]
		};
	}
]);
