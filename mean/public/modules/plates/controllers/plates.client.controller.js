'use strict';

angular.module('plates').controller('PlatesController', ['$scope', '$http', '$stateParams', '$location', '$window', 'ngDialog', 'Authentication', 'Plates',
  function($scope, $http, $stateParams, $location, $window, ngDialog, Authentication, Plates) {
    $scope.authentication = Authentication;

    $scope.authentication = Authentication;
    $scope.gridReady = false;
    $scope.grayOut = false;
    $scope.plateList = [];
    $scope.selectedPlate = null;

    $scope.init = function() {
      $scope.closeDialog();
      $http.get('/plates').success(function(response) {
        $scope.plateList = response;
        $scope.initReactGrid();
      }).error(function(err) {
        $scope.error = err.message;
        $scope.errorDialog();
      });
    };

    $scope.initReactGrid = function() {
      $scope.grid.data = JSON.parse(JSON.stringify($scope.plateList));
      for (var plate = 0; plate < $scope.grid.data.length; ++plate) {
        // Make dates human readable
        $scope.grid.data[plate].project.due = new Date(Date.parse($scope.grid.data[plate].project.due)).toISOString().slice(0,10);
      }
      $scope.gridReady = true;
    };

    $scope.addPlate = function() {
      if ($scope.selectedPlate === null) {
        $scope.error = 'No plate is selected';
        $scope.errorDialog();
      } else {
        $http.post('/plates/assignPlate', $scope.selectedPlate).success(function(response) {
          // Reload ngGrid
          $scope.init();
        }).error(function(err) {
          $scope.error = err.message;
          $scope.errorDialog();
        });
      }
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
      $scope.closeDialog();
      ngDialog.open({
        template: 'errorDialog',
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
