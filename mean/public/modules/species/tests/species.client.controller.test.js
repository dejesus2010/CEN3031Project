'use strict';

(function() {
	// Species Controller Spec
	describe('SpeciesController', function() {
		// Initialize global variables
		var SpeciesController,
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

			// Initialize the Species controller.
			SpeciesController = $controller('SpeciesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one specie object fetched from XHR', inject(function(Species) {
			// Create sample specie using the Species service
			var sampleSpecie = new Species({
				name: 'University of Florida',
				id: 1,
			});

			// Create a sample species array that includes the new specie
			var sampleSpecies = [sampleSpecie];

			// Set GET response
			$httpBackend.expectGET('species').respond(sampleSpecies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.species).toEqualData(sampleSpecies);
		}));

		it('$scope.findOne() should create an array with one specie object fetched from XHR using a specieId URL parameter', inject(function(Species) {
			// Define a sample specie object
			var sampleSpecie = new Species({
				name: 'University of Florida',
				id: 1,
			});

			// Set the URL parameter
			$stateParams.specieId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/species\/([0-9a-fA-F]{24})$/).respond(sampleSpecie);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.specie).toEqualData(sampleSpecie);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then return to previous page', inject(function(Species) {
			// Create a sample specie object
			var sampleSpeciePostData = new Species({
				name: 'University of Florida',
				id: 1,
			});

			// Create a sample specie response
			var sampleSpecieResponse = new Species({
				_id: '525cf20451979dea2c000001',
				name: 'University of Florida',
				id: 1,
			});

			// Fixture mock form input values
			scope.name = 'University of Florida';
			scope.id = 1;

			// Set POST response
			$httpBackend.expectPOST('species', sampleSpeciePostData).respond(sampleSpecieResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');
			expect(scope.id).toEqual(0);

			// Test redirect to previous page once done
			expect($window.history.back).toHaveBeenCalled();
		}));

		it('$scope.update() should update a valid specie', inject(function(Species) {
			// Define a sample specie put data
			var sampleSpeciePutData = new Species({
				_id: '525cf20451979dea2c000001',
				name: 'University of Florida',
				id: 1,
			});

			// Mock specie in scope
			scope.specie = sampleSpeciePutData;

			// Set PUT response
			$httpBackend.expectPUT(/species\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/species/' + sampleSpeciePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid specieId and remove the specie from the scope', inject(function(Species) {
			// Create new specie object
			var sampleSpecie = new Species({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new species array and include the specie
			scope.species = [sampleSpecie];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/species\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSpecie);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.species.length).toBe(0);
		}));
	});
}());