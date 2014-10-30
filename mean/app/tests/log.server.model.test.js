'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Log = mongoose.model('Log');

/**
 * Globals
 */
var user, log;

/**
 * Unit tests
 */
describe('Log Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});

		user.save(function(err, doc) {
			var userId = doc._id;
			log = new Log({
				user: userId,
				timestamp: Date.now()
			});
			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return log.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should throw an error if trying to save without a user', function(done) {
			log.user = null;

			return log.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should throw an error if trying to save without a timestamp', function(done) {
			log.timestamp = null;

			return log.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Log.remove().exec();
		User.remove().exec();

		done();
	});
});