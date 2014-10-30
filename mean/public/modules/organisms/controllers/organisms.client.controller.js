'use strict';

angular.module('organisms').controller('OrganismController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Organisms',
  function($scope, $stateParams, $location, $window, Authentication, Organisms) {
    $scope.authentication = Authentication;

    $scope.create = function() {
      var organism = new Organisms({
        name: this.name,
        id: this.id,
      });
      organism.$save(function(response) {
        $scope.name = '';
        $scope.id = 0;
        $window.history.back();
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.remove = function(organism) {
      if (organism) {
        organism.$remove();

        for (var i in $scope.organisms) {
          if ($scope.organisms[i] === organism) {
            $scope.organisms.splice(i, 1);
          }
        }
      } else {
        $scope.organism.$remove(function() {
          $location.path('organisms');
        });
      }
    };

    $scope.update = function() {
      var organism = $scope.organism;

      organism.$update(function() {
        $location.path('organisms/' + organism._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function() {
      $scope.organisms = Organisms.query();
    };
    $scope.find();

    $scope.findOne = function() {
      $scope.organism = Organisms.get({
        organismId: $stateParams.organismId
      });
    };

    $scope.newOrganismId = function() {
      $scope.id = $scope.organisms.length === 0 ? 1 : Math.max.apply(Math, $scope.organisms.map(function(obj){return obj.id;})) + 1;
      return $scope.id;
    };
  }
]);