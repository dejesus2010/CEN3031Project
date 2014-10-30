'use strict';

(function() {
	// Organisms Controller Spec
	describe('OrganismController', function() {
		// Initialize global variables
		var OrganismController,
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
			OrganismController = $controller('OrganismController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one organism object fetched from XHR', inject(function(Organisms) {
			// Create sample organism using the Organisms service
			var sampleOrganism = new Organisms({
				name: 'University of Florida',
				id: 1,
			});

			// Create a sample organisms array that includes the new organism
			var sampleOrganism = [sampleOrganism];

			// Set GET response
			$httpBackend.expectGET('organisms').respond(sampleOrganism);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.organisms).toEqualData(sampleOrganism);
		}));

		it('$scope.findOne() should create an array with one organism object fetched from XHR using a organismId URL parameter', inject(function(Organisms) {
			// Define a sample organism object
			var sampleOrganism = new Organisms({
				name: 'University of Florida',
				id: 1,
			});

			// Set the URL parameter
			$stateParams.organismId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/organisms\/([0-9a-fA-F]{24})$/).respond(sampleOrganism);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.organism).toEqualData(sampleOrganism);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then return to previous page', inject(function(Organisms) {
			// Create a sample organism object
			var sampleOrganismPostData = new Organisms({
				name: 'University of Florida',
				id: 1,
			});

			// Create a sample organism response
			var sampleOrganismResponse = new Organisms({
				_id: '525cf20451979dea2c000001',
				name: 'University of Florida',
				id: 1,
			});

			// Fixture mock form input values
			scope.name = 'University of Florida';
			scope.id = 1;

			// Set POST response
			$httpBackend.expectPOST('organisms', sampleOrganismPostData).respond(sampleOrganismResponse);

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
			var sampleOrganismPutData = new Organisms({
				_id: '525cf20451979dea2c000001',
				name: 'University of Florida',
				id: 1,
			});

			// Mock organism in scope
			scope.organism = sampleOrganismPutData;

			// Set PUT response
			$httpBackend.expectPUT(/organisms\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/organisms/' + sampleOrganismPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid organismId and remove the organism from the scope', inject(function(Organisms) {
			// Create new organism object
			var sampleOrganism = new Organisms({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new organisms array and include the organism
			scope.organisms = [sampleOrganism];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/organisms\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOrganism);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.organisms.length).toBe(0);
		}));

		it('$scope.newOrganismId() should retrieve a list of all organisms and set the correct id', inject(function(Organisms) {
			// Create new organisms objects
			var sampleOrganism0 = new Organisms({
				_id: '525a8422f6d0f87f0e407a34',
				id: 4
			});

			var sampleOrganism1 = new Organisms({
				_id: '525a8422f6d0f87f0e407a35',
				id: 6
			});

			// Create new customers array and include our sample customers
			var sampleOrganism = [sampleOrganism0, sampleOrganism1];

			// Set expected GET response
			$httpBackend.expectGET('organisms').respond(sampleOrganism);

			// Find a new customer id
			scope.organisms = Organisms.query();
			$httpBackend.flush();

			expect(scope.newOrganismId()).toBe(7);
		}));

		it('$scope.newCustomerId() should set the id to 1 if no existing customers are found', inject(function(Organisms) {
			// Set expected GET response
			$httpBackend.expectGET('organisms').respond([]);

			// Find a new customer id
			scope.organisms = Organisms.query();
			$httpBackend.flush();
			expect(scope.newOrganismId()).toBe(1);
		}));
	});
}());