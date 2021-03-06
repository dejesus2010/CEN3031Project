'use strict';

angular.module('projects').controller('ProjectsController', ['$animate','$window', '$http', '$scope', '$stateParams', '$location', 'ngDialog', 'Authentication', 'Projects', 'Customers', 'Organisms', '$upload', 'worklistFactory',
	function($animate, $window, $http, $scope, $stateParams, $location, ngDialog, Authentication, Projects, Customers, Organisms, $upload, worklistFactory) {

		$scope.authentication = Authentication;
		$scope.customers = Customers.query();
		$scope.organisms = Organisms.query();
		$scope.projects = [];
		$scope.gridReady = false;
		$scope.projectIdent = '';

		$scope.numberOfSamples = 0;
		$scope.customer = {};
		$scope.organism = {};

		$scope.init = function() {
			$scope.allProjectsActive = true;
			$scope.openProjectsActive = false;
			$scope.closedProjectsActive = false;

			$scope.projects = Projects.query(function(err, res) {
				$scope.initReactGrid();
			});
		};

		$scope.showAllProjects = function(){
			$scope.init();
		};

		$scope.showProjectsByStatus = function(status, openProjectsActive, closedProjectsActive){
			$scope.allProjectsActive = false;
			$scope.openProjectsActive = openProjectsActive;
			$scope.closedProjectsActive = closedProjectsActive;

			$http.get('http://localhost:3000/projectsByStatus/' + status).success(function(projects){

				$scope.projects = projects;
				$scope.initReactGrid();
			});
		};

		$scope.create = function() {
			if ($scope.customer.selected === undefined || $scope.organism.selected === undefined) {
				$scope.error = 'Customer and Organism must be selected';
				return;
			}
			var project = new Projects({
				projectCode: $scope.projectCode(),
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
         project.$remove();
         if($scope.projects) {
             for (var i in $scope.projects) {
                 if ($scope.projects[i] === project) {
                     $scope.projects.splice(i, 1);
                 }
             }
         }
         //emit signal notifies the Work List to update in case an assigned plate was deleted
         $scope.$emit('workListUpdated');
         $location.path('projects');
		};

		$scope.onFileSelect = function(file) {
			$scope.upload = $upload.upload({
				url: '/projects/' + $scope.project._id + '/UploadPlateLayout',
				method: 'POST',
				file: file
			}).success(function(data, status, headers, config) {
				$http.post('projects/' + $scope.project._id + '/GeneratePlates');
				$window.location.reload();
			}).error(function(err) {
				console.log('error');
			});
		};

		$scope.generatePlateTemplate = function(){
			$http.post('projects/' + $scope.project._id + '/GeneratePlateTemplate?numberOfSamples=' + $scope.numberOfSamples);
			$window.location.reload();
		};

		$scope.confirmRemove = function() {
			ngDialog.open({
				template: 'deleteConfirmDialog',
				className: 'ngdialog-theme-default',
				scope: $scope,
				showClose: false
			});
			$scope.grayOut = true;
		};

		$scope.closeDialog = function() {
			ngDialog.closeAll();
			$scope.grayOut = false;
		};

		$scope.addPlates = function(selectedPlates) {
			var reloadCounter = selectedPlates.length;
			for (var plate in selectedPlates) {
				worklistFactory.addPlateToWorkList(selectedPlates[plate], function(err) {
					if (err) {
						$scope.error = err;
					}
					reloadCounter = reloadCounter - 1;
					if (reloadCounter === 0) {
						// Reload page and update worklist indicator when all plates have been added
						$scope.$emit('workListUpdated');
						$scope.findOne();
					}
				}); /*jshint ignore:line */
			}
		};

		$scope.update = function() {
			var project = $scope.project;
			project.projectCode = $scope.projectCode();
			project.customer = $scope.selectedCustomer.selected;
			project.organism = $scope.selectedOrganism.selected;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.findOne = function() {
            	$scope.project = Projects.get({
                projectId: $stateParams.projectId
            }, function(err, res) {
                $scope.selectedCustomer = {selected: $scope.project.customer};
                $scope.selectedOrganism = {selected: $scope.project.organism};
                $scope.disabled = true;
                $scope.getLatestStepCounts();
            });
		};

        $scope.getLatestStepCounts = function() {
            //the array to return
            //will have a count of # plates @ each index (each index = a step)
            var latestStepCounts = [];
            //create an empty array with as many slots as there are steps
            //we will probably have to replace '14' with reading the number
            //of steps associated with a sequencing method later
            for(var i = 0; i < 14; ++i){
                latestStepCounts.push(0);
            }
            for(var plateIndex in $scope.project.plates){
                //for every plate in a step, increment the count for every step
                //before it indicating how many plates have moved through that step
                for(var j = 0; j < $scope.project.plates[plateIndex].stage; ++j)
                    ++latestStepCounts[j];
            }
            $scope.latestStepCounts = latestStepCounts;
        };

		$scope.numSamples = function() {
			if ($scope.project === undefined || $scope.project.plates === undefined) {
				return 0;
			} else {
				return $scope.project.plates.reduce(function(sum, plate) {
					return sum + plate.samples.length;
				}, 0);
			}
		};

		$scope.editing = function() {
			$scope.isEdit = true;
		};

		$scope.projectCode = function() {
			// Populates the projectCode with the specified identifier and a unique project number.
			if ($scope.isEdit) {
				if ($scope.selectedCustomer !== undefined) {
					$scope.customer.selected = JSON.parse(JSON.stringify($scope.selectedCustomer.selected));
				}
				if ($scope.selectedOrganism !== undefined) {
					$scope.organism.selected = JSON.parse(JSON.stringify($scope.selectedOrganism.selected));
				}
				// If we aren't changing the customer or organism of a project, don't bother generating a new project id
				if ($scope.project !== undefined && $scope.customer.selected !== undefined && $scope.organism.selected !== undefined) {
					if ($scope.project.customer._id === $scope.customer.selected._id && $scope.project.organism._id === $scope.organism.selected._id) {
						return $scope.project.projectCode;
					}
				}
			}
			var projectCode = $scope.customer.selected !== undefined ? $scope.customer.selected.code : 'XXX';
			projectCode = projectCode + '_';
			// Padding zeros
			projectCode = projectCode.concat($scope.organism.selected !== undefined ? ('0' + $scope.organism.selected.id).slice(-2) : 'XX');
			projectCode = projectCode.concat($scope.customer.selected !== undefined ? ('0' + $scope.customer.selected.id).slice(-2) : 'XX');
			// Getting unique project number
			if ($scope.organism.selected && $scope.customer.selected) {
				var projectNumber = 0;
				// Iterate through all current projects that match the customer and organism we've picked
				for (var project = 0; project < $scope.projects.length; ++project) {
					if ($scope.projects[project].projectCode.slice(4,8) === projectCode.slice(4)) {
						projectNumber = parseInt($scope.projects[project].projectCode.slice(8)) > projectNumber ? parseInt($scope.projects[project].projectCode.slice(8)) : projectNumber;
					}
				}
				++projectNumber;
				// Again, padding zeros because of the project code format
				projectCode = projectCode.concat(('0' + projectNumber).slice(-2));
			} else {
				projectCode = projectCode.concat('XX');
			}
			return projectCode;
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
