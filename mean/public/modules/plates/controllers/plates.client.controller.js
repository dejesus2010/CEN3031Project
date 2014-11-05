'use strict';

angular.module('plates').controller('PlatesController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Plates',
  function($scope, $stateParams, $location, $window, Authentication, Plates) {
    $scope.authentication = Authentication;

    $scope.remove = function(plate) {
      if (plate) {
        plate.$remove();

        for (var i in $scope.plates) {
          if ($scope.plates[i] === plate) {
            $scope.plates.splice(i, 1);
          }
        }
      } else {
        $scope.plate.$remove(function() {
          $location.path('plates');
        });
      }
    };

    $scope.update = function() {
      var plate = $scope.plate;

      plate.$update(function() {
        $location.path('plates/' + plate._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.findOne = function() {
      $scope.plate = Plates.get({
        plateId: $stateParams.plateId
      }, function(err, doc) {
        var plateStage = $scope.plate.stage;
        $scope.steps[plateStage - 1].active = true;
        // Disable the steps that haven't been reached yet
        for (var i = plateStage - 1; i < $scope.steps.length; ++i) {
          $scope.steps[i].disabled = true;
        }
      });
    };

    $scope.init = function() {
      $scope.findOne();
    };

    $scope.steps = [{
        title: '1'
      }, {
        title: '2'
      }, {
        title: '3'
      }, {
        title: '4'
      }, {
        title: '5'
      }, {
        title: '6'
      }, {
        title: '7'
      }, {
        title: '8'
      }, {
        title: '9'
      }, {
        title: '10'
      }, {
        title: '11'
      }, {
        title: '12'
      }, {
        title: '13'
      }, {
        title: '14'
      }
    ];
  }
]);
