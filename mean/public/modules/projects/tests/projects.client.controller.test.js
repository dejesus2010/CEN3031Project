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

		it('$scope.init() should create an array with at least one project object fetched from XHR', inject(function(Projects) {
			// Create sample project using the Projects service
			var sampleProject = new Projects({
				projectCode: 'ABC',
				description: 'MEAN rocks!',
				due: '2014-10-30'
			});

			// Create a sample projects array that includes the new project
			var sampleProjects = [sampleProject];

			// Account for the Customers query
			$httpBackend.expectGET('customers').respond();

			// Account for the Organisms query
			$httpBackend.expectGET('organisms').respond();

			// Set GET response
			$httpBackend.expectGET('projects').respond(sampleProjects);

			// Run controller functionality
			scope.init();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projects).toEqualData(sampleProjects);
		}));

		it('$scope.findOne() should create an array with one project object fetched from XHR using a projectId URL parameter', inject(function(Projects) {
			// Define a sample project object
			var sampleProject = new Projects({
				projectCode: 'ABC',
				description: 'MEAN rocks!',
                plates: []
			});

			// Set the URL parameter
			$stateParams.projectId = '525a8422f6d0f87f0e407a33';

			// Account for the Customer query
			$httpBackend.expectGET('customers').respond();

			// Account for the Organisms query
			$httpBackend.expectGET('organisms').respond();

			// Set GET response
			$httpBackend.expectGET(/projects\/([0-9a-fA-F]{24})$/).respond(sampleProject);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.project).toEqualData(sampleProject);
		}));


		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Projects, Customers, Organisms) {
			// Create a sample customer object
			var sampleCustomer = new Customers({
			  _id: '525cf20451979dea2c000002',
			  name: 'University of Florida',
			  id: 37,
			  code: 'UFL'
			});

			// Create a sample organism object
			var sampleOrganism = new Organisms({
			  _id: '525cf20451979dea2c000003',
			  id: 1,
			  name: 'Burrito'
			});

			// Create a sample project object
			var sampleProjectPostData = new Projects({
			  projectCode: 'ABC',
			  description: 'MEAN rocks!',
			  customer: sampleCustomer._id,
			  organism: sampleOrganism._id
			});

			// Create a sample project response
			var sampleProjectResponse = new Projects({
			  _id: '525cf20451979dea2c000001',
			  projectCode: 'ABC',
			  description: 'MEAN rocks!'
			});


			// Create organism and customer responses
			var customerResponse = [sampleCustomer];
			var organismResponse = [sampleOrganism];
			scope.customer.selected = sampleCustomer;
			scope.organism.selected = sampleOrganism;

			// Fixture mock form input values
			scope.projectCode = function() { return 'ABC';};
			scope.description = 'MEAN rocks!';

			// Account for customers query
			$httpBackend.expectGET('customers').respond(customerResponse);

			// Account for organisms query
			$httpBackend.expectGET('organisms').respond(organismResponse);

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

		it('$scope.create() should throw an error if a customer or organism hasn\'t been selected' , inject(function(Projects, Customers, Organisms) {
			scope.create();
			expect(scope.error).toBe('Customer and Organism must be selected');
		}));

		it('$scope.update() should update a valid project', inject(function(Projects, Customers, Organisms) {
			// Create a sample customer object
			var sampleCustomer = new Customers({
			  _id: '525cf20451979dea2c000002',
			  name: 'University of Florida',
			  id: 37,
			  code: 'UFL'
			});

			// Create a sample organism object
			var sampleOrganism = new Organisms({
			  _id: '525cf20451979dea2c000003',
			  id: 1,
			  name: 'Burrito'
			});

			// Define a sample project put data
			var sampleProjectPutData = new Projects({
				_id: '525cf20451979dea2c000001',
				projectcode: 'ABC',
				description: 'MEAN Rocks!'
			});

			// Mock project in scope
			scope.project = sampleProjectPutData;
			scope.selectedCustomer = {selected: sampleCustomer};
			scope.selectedOrganism = {selected: sampleCustomer};

			// Account for the Customer query
			$httpBackend.expectGET('customers').respond();

			// Account for the Organisms query
			$httpBackend.expectGET('organisms').respond();

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

			// Account for the Organisms query
			$httpBackend.expectGET('organisms').respond();

			// Set expected DELETE response
			$httpBackend.expectDELETE(/projects\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProject);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projects.length).toBe(0);
		}));

		it('$scope.initReactGrid() should set gridReady equal to true when done', inject(function(Projects) {
			scope.initReactGrid();
			expect(scope.gridReady).toBeTruthy();
		}));

		it('$scope.initReactGrid() should set $scope.grid.data equal to scope.projects modified', inject(function(Projects) {
			var sampleProject = new Projects({
				_id: '525a8422f6d0f87f0e407a33',
				due: '2014-10-30'
			});

			// Create new projects array and include the project
			scope.projects = [sampleProject];

			scope.initReactGrid();

			// Modify sampleProject
			sampleProject.projectStatus = 'In Progress';

			expect(scope.grid.data).toEqualData([sampleProject]);
		}));

		it('$scope.initReactGrid() should convert the due date to yyyy-mm-dd', inject(function(Projects) {
			var sampleProject = new Projects({
				_id: '525a8422f6d0f87f0e407a33',
				due: '2014-10-30T04:00:00.000Z'
			});

			// Create new projects array and include the project
			scope.projects = [sampleProject];

			scope.initReactGrid();

			expect(scope.grid.data[0].due).toEqual('2014-10-30');
		}));

		it('$scope.initReactGrid() should correctly set projectStatus', inject(function(Projects) {
			var sampleProject = new Projects({
				_id: '525a8422f6d0f87f0e407a33',
				due: '2014-10-30T04:00:00.000Z',
				projectStatus: false
			});

			var sampleProject2 = new Projects({
				_id: '525a8422f6d0f87f0e407a33',
				due: '2014-10-30T04:00:00.000Z',
				projectStatus: true
			});

			// Create new projects array and include the project
			scope.projects = [sampleProject, sampleProject2];

			scope.initReactGrid();

			expect(scope.grid.data[0].projectStatus).toEqual('In Progress');
			expect(scope.grid.data[1].projectStatus).toEqual('Completed');
		}));

		it('$scope.projectCode() should return a unique projectCode', inject(function(Projects) {

			// Create a sample project object
			var sampleProject = new Projects({
			  projectCode: 'ABC_012345',
			  description: 'MEAN rocks!',
				due: '2014-10-30T04:00:00.000Z'
			});
			// Create a sample projects array that includes the new project
			var sampleProjects = [sampleProject];

			// Account for the Customers query
			$httpBackend.expectGET('customers').respond();

			// Account for the Organisms query
			$httpBackend.expectGET('organisms').respond();

			// Set GET response
			$httpBackend.expectGET('projects').respond(sampleProjects);

			// Run controller functionality
			scope.init();
			$httpBackend.flush();

			scope.organism = {selected: {id: 1}};
			scope.customer = {selected: {id: 23, code: 'ABC'}};

			expect(scope.projectCode()).toBe('ABC_012346');
		}));

		it('$scope.projectCode() should return the current project code if organism and customer haven\'t been changed in edit mode', inject(function(Projects) {

			// Create a sample project object
			var sampleProject = new Projects({
			  projectCode: 'ABC_012345',
			  description: 'MEAN rocks!',
				due: '2014-10-30T04:00:00.000Z',
				customer: {
					_id: '12345'
				},
				organism: {
					_id: '54321'
				}
			});
			// Create a sample projects array that includes the new project
			var sampleProjects = [sampleProject];

			// Account for the Customers query
			$httpBackend.expectGET('customers').respond();

			// Account for the Organisms query
			$httpBackend.expectGET('organisms').respond();

			// Set GET response
			$httpBackend.expectGET('projects').respond(sampleProjects);

			// Run controller functionality
			scope.editing();
			scope.init();
			$httpBackend.flush();

			scope.project = sampleProject;
			scope.organism = {selected: {id: 1, _id: '54321'}};
			scope.customer = {selected: {id: 23, _id: '12345', code: 'ABC'}};

			expect(scope.projectCode()).toBe('ABC_012345');
		}));

		it('$scope.projectCode() should use wildcards when an organism or customer hasn\'t been selected yet', inject(function(Projects) {

			// Create a sample project object
			var sampleProject = new Projects({
			  projectCode: 'ABC_012345',
			  description: 'MEAN rocks!',
				due: '2014-10-30T04:00:00.000Z'
			});
			// Create a sample projects array that includes the new project
			var sampleProjects = [sampleProject];

			// Account for the Customers query
			$httpBackend.expectGET('customers').respond();

			// Account for the Organisms query
			$httpBackend.expectGET('organisms').respond();

			// Set GET response
			$httpBackend.expectGET('projects').respond(sampleProjects);

			// Run controller functionality
			scope.init();
			$httpBackend.flush();

			scope.customer = {selected: {id: 23, code: 'ABC'}};

			expect(scope.projectCode()).toBe('ABC_XX23XX');
		}));
	});
}());
