'use strict';

(function() {
	// Worklist controller Controller Spec
	describe('Worklist Controller Tests', function() {
		// Initialize global variables
		var WorklistControllerController,
			scope,
			$httpBackend,
			$stateParams,
			$location,
			rootScope,
			plate1,
			plate2,
			plate3,
			plate4,
			plate5,
			plate6;

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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _$rootScope_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			rootScope = $rootScope;

			// Initialize the Worklist controller controller.
			WorklistControllerController = $controller('WorklistController', {
				$scope: scope
			});
		}));

		beforeEach(function(){
			plate1 =
			{
				'_id': '54742d03b68c9900007f4933',
				'project': '54742d01b68c9900007f4931',
				'plateCode': '3_040301_P01',
				'logs': [
					'54742d16b68c9900007f4945',
					'54742d24b68c9900007f4949',
					'54742d4db68c9900007f494b',
					'547611bfe4fdfd0000cb52fb'
				],
				'isAssigned' : true,
				'assignee' : '546c3b514a0c100000a4a74c',
				'samples' : [
					'54742d0bb68c9900007f4934',
					'54742d0bb68c9900007f4935',
					'54742d0bb68c9900007f4936',
					'54742d0bb68c9900007f4937',
					'54742d0bb68c9900007f493d'
				],
				'stage' : 1,
				'__v' : 125
			};


			plate2 =
			{
				'_id' : '54742553b68c9900007f488a',
				'project' : '5474254fb68c9900007f4888',
				'plateCode' : 'UF_020101_P01',
				'logs' : [
					'54742563b68c9900007f4897',
					'54742587b68c9900007f48a3',
					'5474259fb68c9900007f48a5',
					'547425dcb68c9900007f48ae',
					'547425e8b68c9900007f48b2',
					'5477d1c890189700006f96bf'
				],
				'isAssigned' : true,
				'assignee' : '546c3b514a0c100000a4a74c',
				'samples' : [
					'5474255cb68c9900007f488b',
					'5474255cb68c9900007f488c',
					'5474255cb68c9900007f488d',
					'5474255cb68c9900007f488e',
					'5474255cb68c9900007f488f',
					'5474255cb68c9900007f4890',
					'5474255cb68c9900007f4891',
					'5474255cb68c9900007f4892',
					'5474255cb68c9900007f4893',
					'5474255cb68c9900007f4894'
				],
				'stage' : 1,
				'__v' : 165
			};

			plate3 =
			{
				'_id' : '54742536b68c9900007f487c',
				'project' : '54742534b68c9900007f487a',
				'plateCode' : 'NAF_020401_P01',
				'logs' : [
					'54742566b68c9900007f4899',
					'54742585b68c9900007f48a2',
					'5474259eb68c9900007f48a4',
					'547425dab68c9900007f48ad',
					'547425e6b68c9900007f48b0',
					'547425e7b68c9900007f48b1',
					'54742610b68c9900007f48ba',
					'5474262eb68c9900007f48be',
					'5477d1bf90189700006f96b8'
				],
				'isAssigned' : true,
				'assignee' : '546c3b514a0c100000a4a74c',
				'samples' : [
					'54742540b68c9900007f487d',
					'54742540b68c9900007f487e',
					'54742540b68c9900007f487f',
					'54742540b68c9900007f4880',
					'54742540b68c9900007f4881',
					'54742540b68c9900007f4882',
					'54742540b68c9900007f4883',
					'54742540b68c9900007f4884',
					'54742540b68c9900007f4885',
					'54742540b68c9900007f4886'
				],
				'stage' : 1,
				'__v' : 147
			};

			plate4 =
			{
				'_id' : '5472b0a6f0dba434afac3a5f',
				'project' : '5472b0a3f0dba434afac3a5d',
				'plateCode' : 'RDJ_010501_P01',
				'logs' : [
					'5472b0b0f0dba434afac3a60',
					'5472c60e3e5d1400009697c1',
					'5472c63b3e5d1400009697c3',
					'54741f81b68c9900007f47fd',
					'54741fccb68c9900007f4800',
					'5474204cb68c9900007f4805',
					'5477d1c490189700006f96bd'
				],
				'isAssigned' : true,
				'assignee' : '546c3b514a0c100000a4a74c',
				'samples' : [ ],
				'stage' : 1,
				'__v' : 192
			};

			plate5 =
			{
				'_id' : '5472b19cf0dba434afac3a7f',
				'project' : '5472b198f0dba434afac3a7d',
				'plateCode' : 'NAF_010401_P01',
				'logs' : [
				'5472b1b3f0dba434afac3a8a',
				'5472b2e651fda6bac7ac140d',
				'5472c4d2a532ec0000312308',
				'54741f82b68c9900007f47fe',
				'54741f8cb68c9900007f47ff',
				'5474209cb68c9900007f4808',
				'547420a2b68c9900007f4809',
				'5477d1c390189700006f96bb'
			],
				'isAssigned' : true,
				'assignee' : '546c3b514a0c100000a4a74c',
				'samples' : [
				'5472b1a2f0dba434afac3a80',
				'5472b1a2f0dba434afac3a81',
				'5472b1a2f0dba434afac3a82',
				'5472b1a2f0dba434afac3a83',
				'5472b1a2f0dba434afac3a84',
				'5472b1a2f0dba434afac3a85',
				'5472b1a2f0dba434afac3a86',
				'5472b1a2f0dba434afac3a87',
				'5472b1a2f0dba434afac3a88',
				'5472b1a2f0dba434afac3a89'
			],
				'stage' : 2,
				'__v' : 214
			};

			plate6 =
			{
				'_id' : '5472b0a6f0dba434afac3a5f',
				'project' : '5472b0a3f0dba434afac3a5d',
				'plateCode' : 'RDJ_010501_P01',
				'logs' : [
				'5472b0b0f0dba434afac3a60',
				'5472c60e3e5d1400009697c1',
				'5472c63b3e5d1400009697c3',
				'54741f81b68c9900007f47fd',
				'54741fccb68c9900007f4800',
				'5474204cb68c9900007f4805',
				'547420a3b68c9900007f480a',
				'547420eab68c9900007f480c',
				'547420eeb68c9900007f480e',
				'5477d1c490189700006f96bd'
			],
				'isAssigned' : true,
				'assignee' : '546c3b514a0c100000a4a74c',
				'samples' : [ ],
				'stage' : 2,
				'__v' : 192
			};



		});

		it('should remove selected plates from the stage\'s plates when the remove button is pressed', inject(function(){
			var stagePlates = [plate1, plate2, plate3, plate4];
			var selectedPlates = [plate1, plate4];

			$httpBackend.expectPOST('/plates/unassignPlate').respond(false);
			$httpBackend.expectPOST('/plates/unassignPlate').respond(false);
			scope.removePlates(stagePlates, selectedPlates);
			$httpBackend.flush();

			var expectedStagePlates = [plate2, plate3];
			expect(stagePlates).toEqualData(expectedStagePlates);
		}));

		it('should remove the selected plates from the selected plates array when the remove button is pressed', inject(function(){
			var stagePlates = [plate1, plate2, plate3, plate4];
			var selectedPlates = [plate1, plate4];

			$httpBackend.expectPOST('/plates/unassignPlate').respond(false);
			$httpBackend.expectPOST('/plates/unassignPlate').respond(false);
			scope.removePlates(stagePlates, selectedPlates);
			$httpBackend.flush();

			var expectedSelectedPlates = [];
			expect(selectedPlates).toEqualData(expectedSelectedPlates);
		}));

		it('should emit a signal saying the worklist has changed when plates are removed from a stage', inject(function(){
			var stagePlates = [plate1, plate2, plate3, plate4];
			var selectedPlates = [plate1, plate4];

			spyOn(scope, '$emit');
			$httpBackend.expectPOST('/plates/unassignPlate').respond(false);
			$httpBackend.expectPOST('/plates/unassignPlate').respond(false);
			scope.removePlates(stagePlates, selectedPlates);
			$httpBackend.flush();

			expect(scope.$emit).toHaveBeenCalledWith('workListUpdated');
		}));


		it('should direct to the stage\'s step page when the Perform selected button is pressed', inject(function(){
			var plates = [0, plate1, plate2, plate3, plate4];

			spyOn($location, 'path');
			for(var i = 1; i < scope.stageNumberToUrl.length; i++){
				var expectedURL = scope.stageNumberToUrl[i] + '/';
				var expectedStringifyJSON = JSON.stringify(plates[i]);

				var expectedLocation = expectedURL + expectedStringifyJSON;

				scope.directToPage(scope.stageNumberToUrl[i], plates[i]);

				expect($location.path).toHaveBeenCalledWith(expectedLocation);
			}

		}));

		it('should retrieve the plates in the user\'s worklist when the work list page is visited', inject(function(){
			var plates = [plate1, plate2, plate3, plate4, plate5, plate6];

			$httpBackend.expectGET('/plates/userPlates').respond(plates);
			scope.init();
			$httpBackend.flush();

			expect(scope.plates).toEqualData(plates);
		}));

		it('should separate retrieved plates into groups', inject(function(){
			var plates = [plate1, plate2, plate3, plate4, plate5, plate6];
			var expectedGrouping = [15];
			expectedGrouping[0] = [];
			expectedGrouping[1] = [plate1, plate2, plate3, plate4];
			expectedGrouping[2] = [plate5, plate6];
			expectedGrouping[3] = [];
			expectedGrouping[4] = [];
			expectedGrouping[5] = [];
			expectedGrouping[6] = [];
			expectedGrouping[7] = [];
			expectedGrouping[8] = [];
			expectedGrouping[9] = [];
			expectedGrouping[10] = [];
			expectedGrouping[11] = [];
			expectedGrouping[12] = [];
			expectedGrouping[13] = [];


			$httpBackend.expectGET('/plates/userPlates').respond(plates);
			scope.init();
			$httpBackend.flush();

			expect(scope.groupOfPlates).toEqualData(expectedGrouping);
		}));

	});
}());
