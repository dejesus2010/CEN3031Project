'use strict';

angular.module('species').controller('SpeciesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Species',
  function($scope, $stateParams, $location, Authentication, Species) {
    $scope.authentication = Authentication;

    $scope.create = function() {
      var specie = new Species({
        name: this.name,
        id: this.id,
      });
      specie.$save(function(response) {
        $location.path('species/' + response._id);

        $scope.name = '';
        $scope.id = 0;
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.remove = function(specie) {
      if (specie) {
        specie.$remove();

        for (var i in $scope.species) {
          if ($scope.species[i] === specie) {
            $scope.species.splice(i, 1);
          }
        }
      } else {
        $scope.specie.$remove(function() {
          $location.path('species');
        });
      }
    };

    $scope.update = function() {
      var specie = $scope.specie;

      specie.$update(function() {
        $location.path('species/' + specie._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function() {
      $scope.species = Species.query();
    };

    $scope.findOne = function() {
      $scope.specie = Species.get({
        specieId: $stateParams.specieId
      });
    };
  }
]);