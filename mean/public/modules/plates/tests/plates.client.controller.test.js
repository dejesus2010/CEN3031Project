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

		it('$scope.init() should create an HTTP request for the list of unassigned plates and set $scope.plateList', inject(function() {
			var sampleData = [{'__v':0,'_id':'546cc49feedb31ca75693aca','assignee':{'displayName':'Jean-Ralph Aviles','_id':'546aac97e6d1b14748520264'},'isAssigned':true,'plateCode':'UFL_010101_P2','project':{'__v':6,'_id':'546aacc8e6d1b14748520268','created':'2014-11-18T02:19:52.149Z','customer':{'_id':'546aacb7e6d1b14748520265','__v':0,'email':'ufl@ufl.edu','projects':[],'code':'UFL','id':1,'name':'University of Florida'},'description':'asdfad','due':'2014-11-20T05:00:00.000Z','lastEdited':'2014-11-19T04:10:55.239Z','lastEditor':'546aac97e6d1b14748520264','logs':[],'projectCode':'UFL_010101','projectStatus':false,'sequencingMethod':'','user':'546aac97e6d1b14748520264'},'samples':[],'stage':1}];
			$httpBackend.expectGET('/plates/unassigned').respond(sampleData);
			scope.init();
			$httpBackend.flush();

			expect(scope.plateList).toEqual(sampleData);
		}));

		it('$scope.init(\'unassigned\') should create an HTTP request for the list of unassigned plates and set $scope.plateList', inject(function() {
			var sampleData = [{'__v':0,'_id':'546cc49feedb31ca75693aca','assignee':{'displayName':'Jean-Ralph Aviles','_id':'546aac97e6d1b14748520264'},'isAssigned':true,'plateCode':'UFL_010101_P2','project':{'__v':6,'_id':'546aacc8e6d1b14748520268','created':'2014-11-18T02:19:52.149Z','customer':{'_id':'546aacb7e6d1b14748520265','__v':0,'email':'ufl@ufl.edu','projects':[],'code':'UFL','id':1,'name':'University of Florida'},'description':'asdfad','due':'2014-11-20T05:00:00.000Z','lastEdited':'2014-11-19T04:10:55.239Z','lastEditor':'546aac97e6d1b14748520264','logs':[],'projectCode':'UFL_010101','projectStatus':false,'sequencingMethod':'','user':'546aac97e6d1b14748520264'},'samples':[],'stage':1}];
			$httpBackend.expectGET('/plates/unassigned').respond(sampleData);
			scope.init('unassigned');
			$httpBackend.flush();

			expect(scope.plateList).toEqual(sampleData);
		}));

		it('$scope.init(\'assigned\') should create an HTTP request for the list of assigned plates and set $scope.plateList', inject(function() {
			var sampleData = [{'__v':0,'_id':'546cc49feedb31ca75693aca','assignee':{'displayName':'Jean-Ralph Aviles','_id':'546aac97e6d1b14748520264'},'isAssigned':true,'plateCode':'UFL_010101_P2','project':{'__v':6,'_id':'546aacc8e6d1b14748520268','created':'2014-11-18T02:19:52.149Z','customer':{'_id':'546aacb7e6d1b14748520265','__v':0,'email':'ufl@ufl.edu','projects':[],'code':'UFL','id':1,'name':'University of Florida'},'description':'asdfad','due':'2014-11-20T05:00:00.000Z','lastEdited':'2014-11-19T04:10:55.239Z','lastEditor':'546aac97e6d1b14748520264','logs':[],'projectCode':'UFL_010101','projectStatus':false,'sequencingMethod':'','user':'546aac97e6d1b14748520264'},'samples':[],'stage':1}];
			$httpBackend.expectGET('/plates/assigned').respond(sampleData);
			scope.init('assigned');
			$httpBackend.flush();

			expect(scope.plateList).toEqual(sampleData);
		}));

		it('$scope.init(\'all\') should create an HTTP request for the list of all plates and set $scope.plateList', inject(function() {
			var sampleData = [{'__v':0,'_id':'546cc49feedb31ca75693aca','assignee':{'displayName':'Jean-Ralph Aviles','_id':'546aac97e6d1b14748520264'},'isAssigned':true,'plateCode':'UFL_010101_P2','project':{'__v':6,'_id':'546aacc8e6d1b14748520268','created':'2014-11-18T02:19:52.149Z','customer':{'_id':'546aacb7e6d1b14748520265','__v':0,'email':'ufl@ufl.edu','projects':[],'code':'UFL','id':1,'name':'University of Florida'},'description':'asdfad','due':'2014-11-20T05:00:00.000Z','lastEdited':'2014-11-19T04:10:55.239Z','lastEditor':'546aac97e6d1b14748520264','logs':[],'projectCode':'UFL_010101','projectStatus':false,'sequencingMethod':'','user':'546aac97e6d1b14748520264'},'samples':[],'stage':1}];
			$httpBackend.expectGET('/plates').respond(sampleData);
			scope.init('all');
			$httpBackend.flush();

			expect(scope.plateList).toEqual(sampleData);
		}));

		it('$scope.switchTab(tab) should set all tabs to false and call init(tab)', inject(function() {
			var sampleData = [{'__v':0,'_id':'546cc49feedb31ca75693aca','assignee':{'displayName':'Jean-Ralph Aviles','_id':'546aac97e6d1b14748520264'},'isAssigned':true,'plateCode':'UFL_010101_P2','project':{'__v':6,'_id':'546aacc8e6d1b14748520268','created':'2014-11-18T02:19:52.149Z','customer':{'_id':'546aacb7e6d1b14748520265','__v':0,'email':'ufl@ufl.edu','projects':[],'code':'UFL','id':1,'name':'University of Florida'},'description':'asdfad','due':'2014-11-20T05:00:00.000Z','lastEdited':'2014-11-19T04:10:55.239Z','lastEditor':'546aac97e6d1b14748520264','logs':[],'projectCode':'UFL_010101','projectStatus':false,'sequencingMethod':'','user':'546aac97e6d1b14748520264'},'samples':[],'stage':1}];
			scope.unassignedTab = true;
			scope.assignedTab = true;
			scope.allTab = true;

			$httpBackend.expectGET('/plates').respond(sampleData);
			scope.switchTab('all');
			$httpBackend.flush();

			expect(scope.plateList).toEqual(sampleData);
			expect(scope.unassignedTab).toBeFalsy();
			expect(scope.assignedTab).toBeFalsy();
			expect(scope.allTab).toBeTruthy()
		}));

		it('$scope.initReactGrid() should format $scope.grid.data\'s dates and set $scope.gridReady to true', inject(function() {
			scope.plateList = [{'__v':0,'_id':'546cc49feedb31ca75693aca','assignee':{'displayName':'Jean-Ralph Aviles','_id':'546aac97e6d1b14748520264'},'isAssigned':true,'plateCode':'UFL_010101_P2','project':{'__v':6,'_id':'546aacc8e6d1b14748520268','created':'2014-11-18T02:19:52.149Z','customer':{'_id':'546aacb7e6d1b14748520265','__v':0,'email':'ufl@ufl.edu','projects':[],'code':'UFL','id':1,'name':'University of Florida'},'description':'asdfad','due':'2014-11-20T05:00:00.000Z','lastEdited':'2014-11-19T04:10:55.239Z','lastEditor':'546aac97e6d1b14748520264','logs':[],'projectCode':'UFL_010101','projectStatus':false,'sequencingMethod':'','user':'546aac97e6d1b14748520264'},'samples':[],'stage':1}];
			scope.grid = {data: null};
			scope.initReactGrid();

			expect(scope.grid.data[0].project.due).toBe('2014-11-20');
			expect(scope.gridReady).toBeTruthy();
			expect(scope.error).toBe('');
		}));

		it('$scope.addPlate() should send the correct HTTP request and reinit the ngGrid', inject(function() {
			scope.selectedPlate = {'__v':0,'_id':'546cc49feedb31ca75693aca','assignee':null,'isAssigned':false,'plateCode':'UFL_010101_P2','project':{'__v':6,'_id':'546aacc8e6d1b14748520268','created':'2014-11-18T02:19:52.149Z','customer':{'_id':'546aacb7e6d1b14748520265','__v':0,'email':'ufl@ufl.edu','projects':[],'code':'UFL','id':1,'name':'University of Florida'},'description':'asdfad','due':'2014-11-20T05:00:00.000Z','lastEdited':'2014-11-19T04:10:55.239Z','lastEditor':'546aac97e6d1b14748520264','logs':[],'projectCode':'UFL_010101','projectStatus':false,'sequencingMethod':'','user':'546aac97e6d1b14748520264'},'samples':[],'stage':1};

			$httpBackend.expectPOST('/plates/assignPlate').respond(200);
			$httpBackend.expectGET('/plates/unassigned').respond([scope.selectedPlate]);
			scope.addPlate();
			$httpBackend.flush();

			expect(scope.error).toBe('');
		}));

		it('$scope.addPlate() should not send an HTTP request if a plate hasn\'t been selected and open the error dialog', inject(function() {
			scope.selectedPlate = null;
			scope.grayOut = false;

			scope.addPlate();
			expect(scope.grayOut).toBeTruthy();
			expect(scope.error).toBe('No plate is selected');
		}));

		it('$scope.addPlate() should not send an HTTP request if it knows the selectedPlate is already assigned and open an error dialog', inject(function() {
			scope.selectedPlate = {isAssigned: true}
			scope.grayOut = false;

			scope.addPlate();
			expect(scope.grayOut).toBeTruthy();
			expect(scope.error).toBe('Plate is already assigned');
		}));

		it('$scope.addPlate() should open the errorDialog if an HTTP error is returned', inject(function() {
			scope.selectedPlate = {isAssigned: false};
			scope.grayOut = false;

			$httpBackend.expectPOST('/plates/assignPlate').respond(400, {message: 'error message'});
			$httpBackend.expectGET('errorDialog').respond(200, '');
			scope.addPlate();
			$httpBackend.flush();

			expect(scope.grayOut).toBeTruthy();
			expect(scope.error).toBe('error message');
		}));

		it('$scope.confirmAdd should open the ngDialog', inject(function() {
			scope.grayOut = false;
			scope.confirmAdd();

			expect(scope.grayOut).toBeTruthy();
			expect(scope.error).toBe('');
		}));

		it('$scope.closeDialog should close the ngDialog', inject(function() {
			scope.grayOut = true;
			scope.closeDialog();

			expect(scope.grayOut).toBeFalsy();
			expect(scope.error).toBe('');
		}));
	});
}());