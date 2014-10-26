'use strict';

(function() {
	// Organisms Controller Spec
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

			// Expect new organism id request
			$httpBackend.expectGET('organisms').respond([]);

			// Initialize the Organisms controller.
			SpeciesController = $controller('SpeciesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one organism object fetched from XHR', inject(function(Organisms) {
			// Create sample organism using the Organisms service
			var sampleSpecie = new Organisms({
				name: 'University of Florida',
				id: 1,
			});

			// Create a sample organisms array that includes the new organism
			var sampleSpecies = [sampleSpecie];

			// Set GET response
			$httpBackend.expectGET('organisms').respond(sampleSpecies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.organisms).toEqualData(sampleSpecies);
		}));

		it('$scope.findOne() should create an array with one organism object fetched from XHR using a specieId URL parameter', inject(function(Organisms) {
			// Define a sample organism object
			var sampleSpecie = new Organisms({
				name: 'University of Florida',
				id: 1,
			});

			// Set the URL parameter
			$stateParams.specieId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/organisms\/([0-9a-fA-F]{24})$/).respond(sampleSpecie);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.organism).toEqualData(sampleSpecie);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then return to previous page', inject(function(Organisms) {
			// Create a sample organism object
			var sampleSpeciePostData = new Organisms({
				name: 'University of Florida',
				id: 1,
			});

			// Create a sample organism response
			var sampleSpecieResponse = new Organisms({
				_id: '525cf20451979dea2c000001',
				name: 'University of Florida',
				id: 1,
			});

			// Fixture mock form input values
			scope.name = 'University of Florida';
			scope.id = 1;

			// Set POST response
			$httpBackend.expectPOST('organisms', sampleSpeciePostData).respond(sampleSpecieResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');
			expect(scope.id).toEqual(0);

			// Test redirect to previous page once done
			expect($window.history.back).toHaveBeenCalled();
		}));

		it('$scope.update() should update a valid organism', inject(function(Organisms) {
			// Define a sample organism put data
			var sampleSpeciePutData = new Organisms({
				_id: '525cf20451979dea2c000001',
				name: 'University of Florida',
				id: 1,
			});

			// Mock organism in scope
			scope.organism = sampleSpeciePutData;

			// Set PUT response
			$httpBackend.expectPUT(/organisms\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/organisms/' + sampleSpeciePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid specieId and remove the organism from the scope', inject(function(Organisms) {
			// Create new organism object
			var sampleSpecie = new Organisms({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new organisms array and include the organism
			scope.organisms = [sampleSpecie];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/organisms\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSpecie);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.organisms.length).toBe(0);
		}));

		it('$scope.newSpecieId() should retrieve a list of all organisms and set the correct id', inject(function(Organisms) {
			// Create new organisms objects
			var sampleSpecie0 = new Organisms({
				_id: '525a8422f6d0f87f0e407a34',
				id: 4
			});

			var sampleSpecie1 = new Organisms({
				_id: '525a8422f6d0f87f0e407a35',
				id: 6
			});

			// Create new customers array and include our sample customers
			var sampleSpecies = [sampleSpecie0, sampleSpecie1];

			// Set expected GET response
			$httpBackend.expectGET('organisms').respond(sampleSpecies);

			// Find a new customer id
			scope.organisms = Organisms.query();
			$httpBackend.flush();

			expect(scope.newSpecieId()).toBe(7);
		}));

		it('$scope.newCustomerId() should set the id to 1 if no existing customers are found', inject(function(Organisms) {
			// Set expected GET response
			$httpBackend.expectGET('organisms').respond([]);

			// Find a new customer id
			scope.organisms = Organisms.query();
			$httpBackend.flush();
			expect(scope.newSpecieId()).toBe(1);
		}));
	});
}());