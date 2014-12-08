'use strict';

angular.module('plates').controller('PlatesController', ['$scope', '$http', '$stateParams', '$location', '$window', 'ngDialog', 'Authentication', 'Plates', 'worklistFactory',
  function($scope, $http, $stateParams, $location, $window, ngDialog, Authentication, Plates, worklistFactory) {
    $scope.authentication = Authentication;
    $scope.gridReady = false;
    $scope.grayOut = false;
    $scope.plateList = [];
    $scope.selectedPlate = null;
    $scope.error = '';
    // Tab flags
    $scope.unassignedTab = false;
    $scope.assignedTab = false;
    $scope.allTab = false;

    $scope.init = function(tab) {
      $scope.closeDialog();
      var url = '/plates';
      switch (tab) {
        case 'unassigned': $scope.unassignedTab = true; url = url.concat('/unassigned'); break;
        case 'assigned':   $scope.assignedTab = true; url = url.concat('/assigned'); break;
        case 'all':        $scope.allTab = true; break;
        default:           $scope.unassignedTab = true; url = url.concat('/unassigned'); break;
      }
      $http.get(url).success(function(response) {
        $scope.plateList = response;
        $scope.initReactGrid();
      }).error(function(err) {
        $scope.error = err.message;
        $scope.errorDialog();
      });
    };

    $scope.switchTab = function(tab) {
      $scope.unassignedTab = false;
      $scope.assignedTab = false;
      $scope.allTab = false;

      $scope.init(tab);
    };

    $scope.currentTab = function() {
      if ($scope.assignedTab) {
        return 'assigned';
      } else if ($scope.allTab) {
        return 'all';
      } else {
        return 'unassigned';
      }
    };

    $scope.initReactGrid = function() {
      // We set the gridReady to false here to force the DOM to update
      $scope.gridReady = false;
      $scope.grid.data = JSON.parse(JSON.stringify($scope.plateList));
      for (var plate = 0; plate < $scope.grid.data.length; ++plate) {
        // Make dates human readable
        $scope.grid.data[plate].project.due = new Date(Date.parse($scope.grid.data[plate].project.due)).toISOString().slice(0,10);
      }
      $scope.gridReady = true;
    };

    $scope.addPlate = function() {
      worklistFactory.addPlateToWorkList($scope.selectedPlate, function(err){
        if(err){
          $scope.error = err;
          $scope.errorDialog();
        } else{
          // Reload ngGrid & emit signal that a plate was added to update Work List plates assigned size in header
          $scope.$emit('workListUpdated');
          $scope.init($scope.currentTab());
        }
      });
    };
    
    $scope.viewSelectedPlate = function() {
    	$scope.closeDialog(function() {
		    $location.path('/plates/' + $scope.selectedPlate._id);
    	});
    };

    $scope.confirmAdd = function() {
      $scope.closeDialog();
      ngDialog.open({
        template: 'addConfirmDialog',
        className: 'ngdialog-theme-default',
        scope: $scope,
        showClose: false
      });
      $scope.grayOut = true;
    };

    $scope.errorDialog = function() {
      // Save error
      var error = $scope.error;
      // Makes sure we'll never have two confirmation dialogs
      $scope.closeDialog();
      $scope.error = error;
      ngDialog.open({
        template: 'errorDialog',
        className: 'ngdialog-theme-default',
        scope: $scope,
        showClose: false
      });
      $scope.grayOut = true;
    };

    $scope.closeDialog = function(callback) {
      ngDialog.closeAll();
      $scope.error = '';
      $scope.grayOut = false;
      if (callback) {
    	  callback();
      }
    };

    $scope.grid = {
      data: [],
      rowClick: function(plate) {
        console.log($scope.authentication);
        $scope.selectedPlate = plate;
        $scope.confirmAdd();
      },
      columnDefs: [{
        field: 'plateCode',
        displayName: 'Plate Code',
        width: '7%'
      }, {
        field: 'project.organism.name',
        displayName: 'Organism',
      }, {
        field: 'project.customer.name',
        displayName: 'Customer'
      }, {
        field: 'project.due',
        displayName: 'Due Date',
        width: '6%'
      }, {
        field: 'assignee.displayName',
        displayName: 'Assignee',
        width: '7%'
      }]
    };
  }
]);
