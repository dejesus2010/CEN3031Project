'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

// Directive for back-button <a href back-button></a>
angular.module(ApplicationConfiguration.applicationModuleName).directive('backButton', function(){
  return {
    restrict: 'A',

    link: function(scope, element, attrs) {
      element.bind('click', function () {
        window.history.back();
        scope.$apply();
      });
    }
  }
});