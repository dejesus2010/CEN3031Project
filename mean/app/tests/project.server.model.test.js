'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Project = mongoose.model('Project'),
	Species = mongoose.model('Specie'),
	Customer = mongoose.model('Customer'),
	User = mongoose.model('User');

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
			due: Date.now(),
			customer: new Customer({id: 1, name: 'University of Florida', code: 'UFL'}),
			species: new Species({id: 3, name: 'squirrel'}),
			description: 'ABC has sent us squirrel dna.',
			user: new User({
				firstName: 'Tim',
				lastName: 'Tebow',
				email: 'tim@ufl.edu',
				password: 'heismen',
				provider: 'local',
			})
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

		it('should be able to show an error when trying to save without a customer', function(done) {
			project.customer = null;

			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without a species', function(done) {
			project.species = null;

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

		it('should be able to show an error when trying to save without a user', function(done) {
			project.user = null;

			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without a due date', function(done) {
			project.due = null;

			return project.save(function(err){
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
