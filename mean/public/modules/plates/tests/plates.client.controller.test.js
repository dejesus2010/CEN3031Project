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

		it('$scope.init() should create an HTTP request for the list of plates and set $scope.plateList', inject(function() {
			var sampleData = [{'__v':0,'_id':'546cc49feedb31ca75693aca','assignee':{'displayName':'Jean-Ralph Aviles','_id':'546aac97e6d1b14748520264'},'isAssigned':true,'plateCode':'UFL_010101_P2','project':{'__v':6,'_id':'546aacc8e6d1b14748520268','created':'2014-11-18T02:19:52.149Z','customer':{'_id':'546aacb7e6d1b14748520265','__v':0,'email':'ufl@ufl.edu','projects':[],'code':'UFL','id':1,'name':'University of Florida'},'description':'asdfad','due':'2014-11-20T05:00:00.000Z','lastEdited':'2014-11-19T04:10:55.239Z','lastEditor':'546aac97e6d1b14748520264','logs':[],'projectCode':'UFL_010101','projectStatus':false,'sequencingMethod':'','user':'546aac97e6d1b14748520264'},'samples':[],'stage':1}];
			$httpBackend.expectGET('/plates').respond(sampleData);
			scope.init();
			$httpBackend.flush();

			expect(scope.plateList).toEqual(sampleData);
		}));

		it('$scope.initReactGrid() should format $scope.grid.data\'s dates and set $scope.gridReady to true', inject(function() {
			scope.plateList = [{'__v':0,'_id':'546cc49feedb31ca75693aca','assignee':{'displayName':'Jean-Ralph Aviles','_id':'546aac97e6d1b14748520264'},'isAssigned':true,'plateCode':'UFL_010101_P2','project':{'__v':6,'_id':'546aacc8e6d1b14748520268','created':'2014-11-18T02:19:52.149Z','customer':{'_id':'546aacb7e6d1b14748520265','__v':0,'email':'ufl@ufl.edu','projects':[],'code':'UFL','id':1,'name':'University of Florida'},'description':'asdfad','due':'2014-11-20T05:00:00.000Z','lastEdited':'2014-11-19T04:10:55.239Z','lastEditor':'546aac97e6d1b14748520264','logs':[],'projectCode':'UFL_010101','projectStatus':false,'sequencingMethod':'','user':'546aac97e6d1b14748520264'},'samples':[],'stage':1}];
			scope.grid = {data: null};
			scope.initReactGrid();

			expect(scope.grid.data[0].project.due).toBe('2014-11-20');
			expect(scope.gridReady).toBeTruthy();
		}));

		it('$scope.addPlate() should send the correct HTTP request and reinit the ngGrid', inject(function() {
			scope.selectedPlate = {'__v':0,'_id':'546cc49feedb31ca75693aca','assignee':{'displayName':'Jean-Ralph Aviles','_id':'546aac97e6d1b14748520264'},'isAssigned':true,'plateCode':'UFL_010101_P2','project':{'__v':6,'_id':'546aacc8e6d1b14748520268','created':'2014-11-18T02:19:52.149Z','customer':{'_id':'546aacb7e6d1b14748520265','__v':0,'email':'ufl@ufl.edu','projects':[],'code':'UFL','id':1,'name':'University of Florida'},'description':'asdfad','due':'2014-11-20T05:00:00.000Z','lastEdited':'2014-11-19T04:10:55.239Z','lastEditor':'546aac97e6d1b14748520264','logs':[],'projectCode':'UFL_010101','projectStatus':false,'sequencingMethod':'','user':'546aac97e6d1b14748520264'},'samples':[],'stage':1};

			$httpBackend.expectPOST('/plates/assignPlate').respond(200);
			$httpBackend.expectGET('/plates').respond([scope.selectedPlate]);
			scope.addPlate();
			$httpBackend.flush();
		}));

		it('$scope.addPlate() should not send an HTTP request if a plate hasn\'t been selected and close any dialogs that may be open', inject(function() {
			scope.selectedPlate = null;
			scope.grayOut = true;

			scope.addPlate();
			expect(scope.grayOut).toBeFalsy();
		}));

		it('$scope.addPlate() should close the ngDialog if an HTTP error is returned', inject(function() {
			scope.selectedPlate = {};
			scope.grayOut = true;

			$httpBackend.expectPOST('/plates/assignPlate').respond(400);
			scope.addPlate();
			$httpBackend.flush();

			expect(scope.grayOut).toBeFalsy();
		}));

		it('$scope.confirmAdd should open the ngDialog', inject(function() {
			scope.grayOut = false;
			scope.confirmAdd();
			expect(scope.grayOut).toBeTruthy();
		}));

		it('$scope.closeDialog should close the ngDialog', inject(function() {
			scope.grayOut = true;
			scope.closeDialog();
			expect(scope.grayOut).toBeFalsy();
		}));

/*
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
*/
	});
}());