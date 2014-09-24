'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Project = mongoose.model('Project')

/**
 * Globals
 */
var project;

/**
 * Unit tests
 */
describe('Project Model Unit Tests:', function() {
	beforeEach(function(done) {
		project = new Project({
			projectCode: 'ABC_010203',
			customerCode: 'ABC',
			species: 'SQR',
			description: 'ABC has sent us squirrel dna.'
		});
		done();
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return project.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without a project code', function(done) {
			project.projectCode = '';

			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without a customer code', function(done) {
			project.customerCode = '';

			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without a species', function(done) {
			project.species = '';

			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without a description', function(done) {
			project.description = '';

			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});

	});

	afterEach(function(done) {
		Project.remove().exec();
		done();
	});
});
