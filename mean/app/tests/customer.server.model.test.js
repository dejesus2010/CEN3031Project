'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  Customer = mongoose.model('Customer');

/**
 * Globals
 */
var customer;

/**
 * Unit tests
 */
describe('Customer Model Unit Tests:', function() {
  beforeEach(function(done) {
    customer = new Customer({
      id: 123,
      name: 'University of Florida',
      code: 'UFL'
    });
    done();
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return customer.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when trying to save without a customer id', function(done) {
      customer.id = null;

      return customer.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when trying to save without a customer name', function(done) {
      customer.name = '';

      return customer.save(function(err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when trying to save without a customer code', function(done) {
      customer.code = '';

      return customer.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Customer.remove().exec();
    done();
  });
});
