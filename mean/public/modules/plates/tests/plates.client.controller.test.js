'use strict';

(function() {
	// Plates Controller Spec
	describe('PlatesController', function() {
		// Initialize global variables
		var PlatesController,
			scope,
			$httpBackend,
			$stateParams,
			$location,
			$window;

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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _$window_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			$window = _$window_;

			// Set spy on $window
			spyOn($window.history, 'back');

			// Initialize the Plates controller.
			PlatesController = $controller('PlatesController', {
				$scope: scope
			});
		}));

		it('$scope.findOne() should create an array with one plate object fetched from XHR using a plateId URL parameter', inject(function(Plates) {
			// Define a sample plate object
			var samplePlate = new Plates({
				plateCode: 'UFL_012345_P2',
				stage: 2,
				project: '545a4bac584211a726dedfcc',
			});

			// Set the URL parameter
			$stateParams.plateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/plates\/([0-9a-fA-F]{24})$/).respond(samplePlate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.plate).toEqualData(samplePlate);
		}));

		it('$scope.update() should update a valid plate', inject(function(Plates) {
			// Define a sample plate object
			var samplePlatePutData = new Plates({
				plateCode: 'UFL_012345_P2',
				stage: 2,
				project: '545a4bac584211a726dedfcc',
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Mock plate in scope
			scope.plate = samplePlatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/plates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/plates/' + samplePlatePutData._id);
		}));
	});
}());