'use strict';

(function() {
	// Customers Controller Spec
	describe('CustomersController', function() {
		// Initialize global variables
		var CustomersController,
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

			// Expect getCustomerId
			$httpBackend.expectGET('customers').respond([]);

			// Initialize the Customers controller.
			CustomersController = $controller('CustomersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one customer object fetched from XHR', inject(function(Customers) {
			// Create sample customer using the Customers service
			var sampleCustomer = new Customers({
				name: 'University of Florida',
				id: 1,
				code: 'UFL',
				email: 'test@example.com'
			});

			// Create a sample customers array that includes the new customer
			var sampleCustomers = [sampleCustomer];

			// Set GET response
			$httpBackend.expectGET('customers').respond(sampleCustomers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.customers).toEqualData(sampleCustomers);
		}));

		it('$scope.findOne() should create an array with one customer object fetched from XHR using a customerId URL parameter', inject(function(Customers) {
			// Define a sample customer object
			var sampleCustomer = new Customers({
				name: 'University of Florida',
				id: 1,
				code: 'UFL',
				email: 'test@example.com'
			});

			// Set the URL parameter
			$stateParams.customerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/customers\/([0-9a-fA-F]{24})$/).respond(sampleCustomer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.customer).toEqualData(sampleCustomer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then return to previous page', inject(function(Customers) {
			// Create a sample customer object
			var sampleCustomerPostData = new Customers({
				name: 'University of Florida',
				id: 1,
				code: 'UFL',
				email: 'test@example.com'
			});

			// Create a sample customer response
			var sampleCustomerResponse = new Customers({
				_id: '525cf20451979dea2c000001',
				name: 'University of Florida',
				id: 1,
				code: 'UFL',
				email: 'test@example.com'
			});

			// Fixture mock form input values
			scope.name = 'University of Florida';
			scope.id = 1;
			scope.code = 'UFL';
			scope.email = 'test@example.com';

			// Set POST response
			$httpBackend.expectPOST('customers', sampleCustomerPostData).respond(sampleCustomerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');
			expect(scope.id).toEqual(0);
			expect(scope.code).toEqual('');
			expect(scope.email).toEqual('');

			// Test redirect to previous page once done
			expect($window.history.back).toHaveBeenCalled();
		}));

		it('$scope.create() should throw an error if a valid identifier hasn\'t been set' , inject(function(Projects, Customers, Organisms) {
			scope.create();
			expect(scope.error).toBe('You must specify a 3 character indentifier');
		}));

		it('$scope.update() should update a valid customer', inject(function(Customers) {
			// Define a sample customer put data
			var sampleCustomerPutData = new Customers({
				_id: '525cf20451979dea2c000001',
				name: 'University of Florida',
				id: 1,
				code: 'UFL',
				email: 'test@example.com'
			});

			// Mock customer in scope
			scope.customer = sampleCustomerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/customers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/customers/' + sampleCustomerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid customerId and remove the customer from the scope', inject(function(Customers) {
			// Create new customer object
			var sampleCustomer = new Customers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new customers array and include the customer
			scope.customers = [sampleCustomer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/customers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCustomer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.customers.length).toBe(0);
		}));

		it('$scope.newCustomerId() should retrieve a list of all customers and set the correct id', inject(function(Customers) {
			// Create new customer objects
			var sampleCustomer0 = new Customers({
				_id: '525a8422f6d0f87f0e407a34',
				id: 4
			});

			var sampleCustomer1 = new Customers({
				_id: '525a8422f6d0f87f0e407a35',
				id: 6
			});

			// Create new customers array and include our sample customers
			var sampleCustomers = [sampleCustomer0, sampleCustomer1];

			// Set expected GET response
			$httpBackend.expectGET('customers').respond(sampleCustomers);

			// Find a new customer id
			scope.customers = Customers.query();
			$httpBackend.flush();

			expect(scope.newCustomerId()).toBe(7);
		}));

		it('$scope.newCustomerId() should set the id to 1 if no existing customers are found', inject(function(Customers) {
			// Set expected GET response
			$httpBackend.expectGET('customers').respond([]);

			// Find a new customer id
			scope.customers = Customers.query();
			$httpBackend.flush();
			expect(scope.newCustomerId()).toBe(1);
		}));

		it('$scope.validateCode() should delete invalid chars from $scope.code and capitalize all letters', inject(function() {
			scope.code = 'T%a';
			scope.validateCode();
			expect(scope.code).toBe('TA');
		}));
	});
}());
