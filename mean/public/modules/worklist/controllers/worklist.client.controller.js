'use strict';

angular.module('worklist').controller('WorklistController', ['$scope', '$http', 'Plates',
	function($scope, $http, Plates){


		// This array is to group plates into stages.
		$scope.groupOfPlates = [15];

		$scope.stageNumberToName = ['None', 'Samples Arrive', 'Quantification', 'Normalization'];

		$scope.platesExist = false;

		$scope.init = function(){
			initializeGroupOfPlates();

			assignPlates();


			$http.get('/plates/userPlates').success(function(plates){
				$scope.plates = plates;
				if($scope.plates.length < 1){
					console.log('Received no plates');
					return;
				}
				else{
					$scope.platesExist = true;
					separatePlatesIntoGroups(plates);
					console.log($scope.groupOfPlates);
				}
			});
		};

		var initializeGroupOfPlates = function(){
			for(var i = 0; i < 14; i++){
				$scope.groupOfPlates[i] = [];
			}
		};

		var separatePlatesIntoGroups = function(plates){
			for(var i = 0; i < plates.length; i++){
				var currentPlate = plates[i];
				$scope.groupOfPlates[currentPlate.stage].push(currentPlate);
			}
		};

		var assignPlates = function(){
			$http.post('/plates/assignPlate', {
					'_id' :  '546c3b6c4a0c100000a4a750' ,
					'project' :  '546c3b674a0c100000a4a74e' ,
					'plateCode' : 'UF_010101_P1',
					'isAssigned' : false,
					'assignee' : null,
					'samples' : [
						'546c3b6c4a0c100000a4a751' ,
						'546c3b6c4a0c100000a4a752' ,
						'546c3b6c4a0c100000a4a753' ,
						'546c3b6c4a0c100000a4a754' ,
						'546c3b6c4a0c100000a4a755' ,
						'546c3b6c4a0c100000a4a756' ,
						'546c3b6c4a0c100000a4a757' ,
						'546c3b6c4a0c100000a4a758' ,
						'546c3b6c4a0c100000a4a759' ,
						'546c3b6c4a0c100000a4a75a' ,
						'546c3b6c4a0c100000a4a75b' ,
						'546c3b6c4a0c100000a4a75c' ,
						'546c3b6c4a0c100000a4a75d' ,
						'546c3b6c4a0c100000a4a75e' ,
						'546c3b6c4a0c100000a4a75f' ,
						'546c3b6c4a0c100000a4a760' ,
						'546c3b6c4a0c100000a4a761' ,
						'546c3b6c4a0c100000a4a762' ,
						'546c3b6c4a0c100000a4a763' ,
						'546c3b6c4a0c100000a4a764' ,
						'546c3b6c4a0c100000a4a765' ,
						'546c3b6c4a0c100000a4a766' ,
						'546c3b6c4a0c100000a4a767' ,
						'546c3b6c4a0c100000a4a768' ,
						'546c3b6c4a0c100000a4a769' ,
						'546c3b6c4a0c100000a4a76a' ,
						'546c3b6c4a0c100000a4a76b' ,
						'546c3b6c4a0c100000a4a76c' ,
						'546c3b6c4a0c100000a4a76d' ,
						'546c3b6c4a0c100000a4a76e' ,
						'546c3b6c4a0c100000a4a76f' ,
						'546c3b6c4a0c100000a4a770' ,
						'546c3b6c4a0c100000a4a771' ,
						'546c3b6c4a0c100000a4a772' ,
						'546c3b6c4a0c100000a4a773' ,
						'546c3b6c4a0c100000a4a774' ,
						'546c3b6c4a0c100000a4a775' ,
						'546c3b6c4a0c100000a4a776' ,
						'546c3b6c4a0c100000a4a777' ,
						'546c3b6c4a0c100000a4a778' ,
						'546c3b6c4a0c100000a4a779' ,
						'546c3b6c4a0c100000a4a77a' ,
						'546c3b6c4a0c100000a4a77b' ,
						'546c3b6c4a0c100000a4a77c' ,
						'546c3b6c4a0c100000a4a77d' ,
						'546c3b6c4a0c100000a4a77e' ,
						'546c3b6c4a0c100000a4a77f' ,
						'546c3b6c4a0c100000a4a780' ,
						'546c3b6c4a0c100000a4a781' ,
						'546c3b6c4a0c100000a4a782' ,
						'546c3b6c4a0c100000a4a783' ,
						'546c3b6c4a0c100000a4a784' ,
						'546c3b6c4a0c100000a4a785' ,
						'546c3b6c4a0c100000a4a786' ,
						'546c3b6c4a0c100000a4a787' ,
						'546c3b6c4a0c100000a4a788' ,
						'546c3b6c4a0c100000a4a789' ,
						'546c3b6c4a0c100000a4a78a' ,
						'546c3b6c4a0c100000a4a78b' ,
						'546c3b6c4a0c100000a4a78c' ,
						'546c3b6c4a0c100000a4a78d' ,
						'546c3b6c4a0c100000a4a78e' ,
						'546c3b6c4a0c100000a4a78f' ,
						'546c3b6c4a0c100000a4a790' ,
						'546c3b6c4a0c100000a4a791' ,
						'546c3b6c4a0c100000a4a792' ,
						'546c3b6c4a0c100000a4a793' ,
						'546c3b6c4a0c100000a4a794' ,
						'546c3b6c4a0c100000a4a795' ,
						'546c3b6c4a0c100000a4a796' ,
						'546c3b6c4a0c100000a4a797' ,
						'546c3b6c4a0c100000a4a798' ,
						'546c3b6c4a0c100000a4a799' ,
						'546c3b6c4a0c100000a4a79a' ,
						'546c3b6c4a0c100000a4a79b' ,
						'546c3b6c4a0c100000a4a79c' ,
						'546c3b6c4a0c100000a4a79d' ,
						'546c3b6c4a0c100000a4a79e' ,
						'546c3b6c4a0c100000a4a79f' ,
						'546c3b6c4a0c100000a4a7a0' ,
						'546c3b6c4a0c100000a4a7a1' ,
						'546c3b6c4a0c100000a4a7a2' ,
						'546c3b6c4a0c100000a4a7a3' ,
						'546c3b6c4a0c100000a4a7a4' ,
						'546c3b6c4a0c100000a4a7a5' ,
						'546c3b6c4a0c100000a4a7a6' ,
						'546c3b6c4a0c100000a4a7a7' ,
						'546c3b6c4a0c100000a4a7a8' ,
						'546c3b6c4a0c100000a4a7a9' ,
						'546c3b6c4a0c100000a4a7aa' ,
						'546c3b6c4a0c100000a4a7ab' ,
						'546c3b6c4a0c100000a4a7ac' ,
						'546c3b6c4a0c100000a4a7ad' ,
						'546c3b6c4a0c100000a4a7ae' ,
						'546c3b6c4a0c100000a4a7af' ,
						'546c3b6c4a0c100000a4a7b0'
					],
					'stage' : 1,
					'__v' : 0
				}

			).success(function(res){
					$http.post('/plates/assignPlate', {
							'_id' :  '546c3e8e735daa0000a03704',
							'project' :  '546c3e8b735daa0000a03702',
							'plateCode' : '3_020301_P1',
							'isAssigned' : false,
							'assignee' : null,
							'samples' : [
								'546c3e8e735daa0000a03705',
								'546c3e8e735daa0000a03706',
								'546c3e8e735daa0000a03707',
								'546c3e8e735daa0000a03708',
								'546c3e8e735daa0000a03709',
								'546c3e8e735daa0000a0370a',
								'546c3e8e735daa0000a0370b',
								'546c3e8e735daa0000a0370c',
								'546c3e8e735daa0000a0370d',
								'546c3e8e735daa0000a0370e',
								'546c3e8e735daa0000a0370f',
								'546c3e8e735daa0000a03710',
								'546c3e8e735daa0000a03711',
								'546c3e8e735daa0000a03712',
								'546c3e8e735daa0000a03713',
								'546c3e8e735daa0000a03714',
								'546c3e8e735daa0000a03715',
								'546c3e8e735daa0000a03716',
								'546c3e8e735daa0000a03717',
								'546c3e8e735daa0000a03718',
								'546c3e8e735daa0000a03719',
								'546c3e8e735daa0000a0371a',
								'546c3e8e735daa0000a0371b',
								'546c3e8e735daa0000a0371c',
								'546c3e8e735daa0000a0371d',
								'546c3e8e735daa0000a0371e',
								'546c3e8e735daa0000a0371f',
								'546c3e8e735daa0000a03720',
								'546c3e8e735daa0000a03721',
								'546c3e8e735daa0000a03722',
								'546c3e8e735daa0000a03723',
								'546c3e8e735daa0000a03724',
								'546c3e8e735daa0000a03725',
								'546c3e8e735daa0000a03726',
								'546c3e8e735daa0000a03727',
								'546c3e8e735daa0000a03728',
								'546c3e8e735daa0000a03729',
								'546c3e8e735daa0000a0372a',
								'546c3e8e735daa0000a0372b',
								'546c3e8e735daa0000a0372c',
								'546c3e8e735daa0000a0372d',
								'546c3e8e735daa0000a0372e',
								'546c3e8e735daa0000a0372f',
								'546c3e8e735daa0000a03730',
								'546c3e8e735daa0000a03731',
								'546c3e8e735daa0000a03732',
								'546c3e8e735daa0000a03733',
								'546c3e8e735daa0000a03734',
								'546c3e8e735daa0000a03735',
								'546c3e8e735daa0000a03736',
								'546c3e8e735daa0000a03737',
								'546c3e8e735daa0000a03738',
								'546c3e8e735daa0000a03739',
								'546c3e8e735daa0000a0373a',
								'546c3e8e735daa0000a0373b',
								'546c3e8e735daa0000a0373c',
								'546c3e8e735daa0000a0373d',
								'546c3e8e735daa0000a0373e',
								'546c3e8e735daa0000a0373f',
								'546c3e8e735daa0000a03740',
								'546c3e8e735daa0000a03741',
								'546c3e8e735daa0000a03742',
								'546c3e8e735daa0000a03743',
								'546c3e8e735daa0000a03744',
								'546c3e8e735daa0000a03745',
								'546c3e8e735daa0000a03746',
								'546c3e8e735daa0000a03747',
								'546c3e8e735daa0000a03748',
								'546c3e8e735daa0000a03749',
								'546c3e8e735daa0000a0374a',
								'546c3e8e735daa0000a0374b',
								'546c3e8e735daa0000a0374c',
								'546c3e8e735daa0000a0374d',
								'546c3e8e735daa0000a0374e',
								'546c3e8e735daa0000a0374f',
								'546c3e8e735daa0000a03750',
								'546c3e8e735daa0000a03751',
								'546c3e8e735daa0000a03752',
								'546c3e8e735daa0000a03753',
								'546c3e8e735daa0000a03754',
								'546c3e8e735daa0000a03755',
								'546c3e8e735daa0000a03756',
								'546c3e8e735daa0000a03757',
								'546c3e8e735daa0000a03758',
								'546c3e8e735daa0000a03759',
								'546c3e8e735daa0000a0375a',
								'546c3e8e735daa0000a0375b',
								'546c3e8e735daa0000a0375c',
								'546c3e8e735daa0000a0375d',
								'546c3e8e735daa0000a0375e',
								'546c3e8e735daa0000a0375f',
								'546c3e8e735daa0000a03760',
								'546c3e8e735daa0000a03761',
								'546c3e8e735daa0000a03762',
								'546c3e8e735daa0000a03763',
								'546c3e8e735daa0000a03764'
							],
							'stage' : 1,
							'__v' : 0
						}



					).success(function(res){
						});
				});




		};
	}]);
