'use strict';

//Setting up route
angular.module('steps').config(['$stateProvider',
	function($stateProvider) {
		// Steps state routing
		$stateProvider.
		state('normalization', {
			url: '/steps/normalization/:samples',
			templateUrl: 'modules/steps/views/normalization.client.view.html'
		}).
		state('quantification', {
			url: '/steps/dna-quantification/:samples',
			templateUrl: 'modules/steps/views/quantification.client.view.html'
		}).
		state('sample-arrival', {
			url: '/steps/sample-arrival/:samples',
			templateUrl: 'modules/steps/views/sample-arrival.client.view.html'
		}).
		state('shearing', {
			url: '/steps/shearing/:samples',
			templateUrl: 'modules/steps/views/shearing.client.view.html'
		}).
		state('end-repair', {
			url: '/steps/end-repair/:samples',
			templateUrl: 'modules/steps/views/end-repair.client.view.html'
		}).
		state('adenylation', {
			url: '/steps/adenylation/:samples',
			templateUrl: 'modules/steps/views/adenylation.client.view.html'
		}).
		state('ligation', {
			url: '/steps/ligation/:samples',
			templateUrl: 'modules/steps/views/ligation.client.view.html'
		}).
		state('size-selection', {
			url: '/steps/size-selection/:samples',
			templateUrl: 'modules/steps/views/size-selection.client.view.html'
		}).
		state('pcr-enrichment', {
			url: '/steps/pcr-enrichment/:samples',
			templateUrl: 'modules/steps/views/pcr-enrichment.client.view.html'
		}).
		state('pcr-cleanup', {
			url: '/steps/pcr-cleanup/:samples',
			templateUrl: 'modules/steps/views/pcr-cleanup.client.view.html'
		}).
		state('library-quantification', {
			url: '/steps/library-quantification/:samples',
			templateUrl: 'modules/steps/views/library-quantification.client.view.html'
		}).
		state('pooling', {
			url: '/steps/pooling/:samples',
			templateUrl: 'modules/steps/views/pooling.client.view.html'
		}).
		state('hybridization', {
			url: '/steps/hybridization/:samples',
			templateUrl: 'modules/steps/views/hybridization.client.view.html'
		}).
		state('sequencing', {
			url: '/steps/sequencing/:samples',
			templateUrl: 'modules/steps/views/sequencing.client.view.html'
		});
	}
]);
