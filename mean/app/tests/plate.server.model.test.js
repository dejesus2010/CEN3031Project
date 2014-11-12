'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  Project = mongoose.model('Project'),
  Organisms = mongoose.model('Organism'),
  Customer = mongoose.model('Customer'),
  User = mongoose.model('User'),
  Plates = mongoose.model('Plate');

/**
 * Globals
 */
var plates, projectID;

/**
 * Unit tests
 */
describe('Plates Model Unit Tests:', function() {
    before(function(done){
      var customer = new Customer({id:1, name: 'University of Florida', code: 'UFL', email: 'test@example.com'});
      var organisms = new Organisms({id: 3, name: 'squirrel'});

      customer.save(function(err, doc){
        var customerID = doc._id;
        organisms.save(function(err, doc){
          var organismID = doc._id;
          var project = new Project({
            projectCode: 'ABC_010203',
            due: Date.now(),
            customer: customerID,
            organism: organismID,
            description: 'ABC has sent us squirrel dna.',
            user: new User({
              firstName: 'Tim',
              lastName: 'Tebow',
              email: 'tim@ufl.edu',
              password: 'heismen',
              provider: 'local'
            })
          });
          project.save(function(err, doc) {
            projectID = doc._id;
            done();
          });
        });
      });
    });

  beforeEach(function(done) {
    plates = new Plates({
      plateCode: '4',
      project: projectID,
      users: [new User({
        firstName: 'Tim',
        lastName: 'Tebow',
        email: 'tim@ufl.edu',
        password: 'heismen',
        provider: 'local'
      }), new User({
        firstName: 'Muffin',
        lastName: 'Man',
        email: 'muffinMan@muffin.com',
        password: 'gumdrops',
        provider: 'local'
      })]
    });
    done();
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return plates.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when trying to save without a plate\'s plateCode', function(done) {
      plates.plateCode = null;

      return plates.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when trying to save without an plate\'s project', function(done) {
      plates.project = null;

      return plates.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Plates.remove().exec();
    done();
  });
});
