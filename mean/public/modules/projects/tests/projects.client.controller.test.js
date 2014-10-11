'use strict';

(function() {
	// Projects Controller Spec
	describe('ProjectsController', function() {
		// Initialize global variables
		var ProjectsController,
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

			// Initialize the Projects controller.
			ProjectsController = $controller('ProjectsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one project object fetched from XHR', inject(function(Projects) {
			// Create sample project using the Projects service
			var sampleProject = new Projects({
				projectCode: 'ABC',
				description: 'MEAN rocks!'
			});

			// Create a sample projects array that includes the new project
			var sampleProjects = [sampleProject];

			// Account for the Customers query
			$httpBackend.expectGET('customers').respond();

			// Account for the Species query
			$httpBackend.expectGET('species').respond();

			// Set GET response
			$httpBackend.expectGET('projects').respond(sampleProjects);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projects).toEqualData(sampleProjects);
		}));

		it('$scope.findOne() should create an array with one project object fetched from XHR using a projectId URL parameter', inject(function(Projects) {
			// Define a sample project object
			var sampleProject = new Projects({
				projectCode: 'ABC',
				description: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.projectId = '525a8422f6d0f87f0e407a33';

			// Account for the Customer query
			$httpBackend.expectGET('customers').respond();

			// Account for the Species query
			$httpBackend.expectGET('species').respond();

			// Set GET response
			$httpBackend.expectGET(/projects\/([0-9a-fA-F]{24})$/).respond(sampleProject);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.project).toEqualData(sampleProject);
		}));


		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Projects, Customers, Species) {
			// Create a sample customer object
			var sampleCustomer = new Customers({
			  _id: '525cf20451979dea2c000002',
			  name: 'University of Florida',
			  id: 37,
			  code: 'UFL'
			});

			// Create a sample specie object
			var sampleSpecie = new Species({
			  _id: '525cf20451979dea2c000003',
			  id: 1,
			  name: 'Burrito'
			});

			// Create a sample project object
			var sampleProjectPostData = new Projects({
			  projectCode: 'ABC',
			  description: 'MEAN rocks!',
			  customer: sampleCustomer._id,
			  species: sampleSpecie._id
			});

			// Create a sample project response
			var sampleProjectResponse = new Projects({
			  _id: '525cf20451979dea2c000001',
			  projectCode: 'ABC',
			  description: 'MEAN rocks!'
			});


			// Create specie and customer responses
			var customerResponse = [sampleCustomer];
			var specieResponse = [sampleSpecie];
			scope.customer.selected = sampleCustomer;
			scope.specie.selected = sampleSpecie;

			// Fixture mock form input values
			scope.projectCode = 'ABC';
			scope.description = 'MEAN rocks!';

			// Account for customers query
			$httpBackend.expectGET('customers').respond(customerResponse);

			// Account for species query
			$httpBackend.expectGET('species').respond(specieResponse);

			// Set POST response
			$httpBackend.expectPOST('projects', sampleProjectPostData).respond(sampleProjectResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.projectCode).toEqual('');
			expect(scope.description).toEqual('');

			// Test URL redirection after the project was created
			expect($location.path()).toBe('/projects/' + sampleProjectResponse._id);
		}));

		it('$scope.update() should update a valid project', inject(function(Projects) {
			// Define a sample project put data
			var sampleProjectPutData = new Projects({
				_id: '525cf20451979dea2c000001',
				projectcode: 'ABC',
				description: 'MEAN Rocks!'
			});

			// Mock project in scope
			scope.project = sampleProjectPutData;

			// Account for the Customer query
			$httpBackend.expectGET('customers').respond();

			// Account for the Species query
			$httpBackend.expectGET('species').respond();

			// Set PUT response
			$httpBackend.expectPUT(/projects\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/projects/' + sampleProjectPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid projectId and remove the project from the scope', inject(function(Projects) {
			// Create new project object
			var sampleProject = new Projects({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new projects array and include the project
			scope.projects = [sampleProject];

			// Account for the Customer query
			$httpBackend.expectGET('customers').respond();

			// Account for the Species query
			$httpBackend.expectGET('species').respond();

			// Set expected DELETE response
			$httpBackend.expectDELETE(/projects\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProject);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projects.length).toBe(0);
		}));

		it('$scope.sortBy() should set $scope.sortExpr correctly', inject(function(Projects) {
			scope.sortBy('due');
			expect(scope.reverseSort).toBeFalsy();
			expect(scope.sortExpr).toBe('due');
		}));

		it('$scope.sortBy() should reverse the sort order if sortBy is called a second time', inject(function(Projects) {
			scope.sortBy('due');
			scope.sortBy('due');
			expect(scope.reverseSort).toBeTruthy();
			expect(scope.sortExpr).toBe('due');
		}));
	});
}());
