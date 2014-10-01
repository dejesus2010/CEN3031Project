'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Species = mongoose.model('Specie');

/**
 * Globals
 */
var species;

/**
 * Unit tests
 */
describe('Species Model Unit Tests:', function() {
	beforeEach(function(done) {
		species = new Species({
			id: 123,
			name: 'Red Panda'
		});
		done();
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return species.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without a species id', function(done) {
			species.id = null;

			return species.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without a species name', function(done) {
			species.name = '';

			return species.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Species.remove().exec();
		done();
	});
});
