'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Organisms = mongoose.model('Organism');

/**
 * Globals
 */
var organisms;

/**
 * Unit tests
 */
describe('Organisms Model Unit Tests:', function() {
	beforeEach(function(done) {
		organisms = new Organisms({
			id: 123,
			name: 'Red Panda'
		});
		done();
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return organisms.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without an organism\'s id', function(done) {
			organisms.id = null;

			return organisms.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without an organism\'s name', function(done) {
			organisms.name = '';

			return organisms.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Organisms.remove().exec();
		done();
	});
});
