'use strict';

(function() {
	// Steps Controller Spec
	describe('Steps Controller Tests', function() {
		// Initialize global variables
		var StepsController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Steps controller.
			StepsController = $controller('StepsController', {
				$scope: scope
			});
		}));

		it('should perform step on plates', inject(function() {
			expect(false).toBeTruthy();
		}));

		it('should perform step on plates and remove the plates from the worklist when user wants to remove the plates from the worklist', inject(function() {
			expect(false).toBeTruthy();
		}));

		it('should notify the header that the worklist has been updated after removing the plates from the worklist', inject(function() {
			expect(false).toBeTruthy();
		}));

		it('should redirect the page to the worklist page after performing step on all plates', inject(function() {
			expect(false).toBeTruthy();
		}));

		it('should not gray out the display behind the popup when the dialog is closed', inject(function() {
			expect(false).toBeTruthy();
		}));

	});
}());
