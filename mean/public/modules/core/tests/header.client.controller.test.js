'use strict';

(function() {
	describe('HeaderController', function() {
		//Initialize global variables
		var scope,
			HeaderController,
			httpBackend;

		scope = HeaderController = httpBackend = void 0;

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(inject(function($controller, $rootScope, $httpBackend) {
			scope = $rootScope.$new();

			HeaderController = $controller('HeaderController', {
				$scope: scope
			});

			httpBackend = $httpBackend;
		}));

		it('should expose the authentication service', function() {
			expect(scope.authentication).toBeTruthy();
		});

		it('should initialize sizeOfWorklist to the number of plates assigned to the user', function() {

			scope.sizeOfWorklist = 4;

			httpBackend.expectGET('/numberOfPlatesAssignedToUser').respond(scope.sizeOfWorklist);
			scope.init();
			httpBackend.flush();
			expect(scope.sizeOfWorklist).toBe(4);
		});

		it('should update the work list\'s size icon when a plate is added/deleted from the work list', function() {
			scope.sizeOfWorklist = 4;

			httpBackend.expectGET('/numberOfPlatesAssignedToUser').respond(scope.sizeOfWorklist);
			scope.init();
			scope.$broadcast('workListUpdated'); // simulating a plate being added to the work list
			scope.$digest();
			expect(scope.sizeOfWorklist).toBe(4);
		});
	});
})();
