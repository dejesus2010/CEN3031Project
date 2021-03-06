'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Organism = mongoose.model('Organism');

/**
 * Globals
 */
var organism;

/**
 * Unit tests
 */
describe('Organisms Model Unit Tests:', function() {
	beforeEach(function(done) {
		organism = new Organism({
			id: 123,
			name: 'Red Panda'
		});
		done();
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return organism.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without an organism\'s id', function(done) {
			organism.id = null;

			return organism.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without an organism\'s name', function(done) {
			organism.name = '';

			return organism.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Organism.remove().exec();
		done();
	});
});
