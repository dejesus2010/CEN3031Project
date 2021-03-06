'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    projects = require('../../app/controllers/projects'),
    Project = mongoose.model('Project'),
    Organisms = mongoose.model('Organism'),
    Customer = mongoose.model('Customer'),
    Plate = mongoose.model('Plate'),
    Sample = mongoose.model('Sample'),
    fs = require('fs'),
    User = mongoose.model('User');

/**
 * Globals
 */
var project;

/**
 * Unit tests
 */
describe('Empty Plate Generator Unit Tests:', function() {
    var customerID;
    var organismID;

    before(function(done){
        var customer = new Customer({id:1, name: 'University of Florida', code: 'UFL', email: 'test@example.com'});
        var organisms = new Organisms({id: 3, name: 'squirrel'});

        customer.save(function(err, doc){
            customerID = doc._id;
            organisms.save(function(err, doc){
                organismID = doc._id;
                done();
            });
        });
    });

    beforeEach(function(done) {
        project = new Project({
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
        done();
    });

    describe('EmptyPlateGenerator', function() {
       it('should be able to generate 1 empty plate should we specify 96 samples', function(done) {
            // with 10 samples
            var req = {query: {}};
            req.project = project;
	    req.query.numberOfSamples = 96;
            projects.generatePlateTemplate(req);
            project.plates.length.should.equal(1);
            done();
        });
	it('should be able to generate 1 empty plate from specifying < 96 samples (44)', function(done) {
            //with 96 samples
            var req = {query: {}};
            req.project = project;
            req.project = project;
	    req.query.numberOfSamples = 44;
            projects.generatePlateTemplate(req);
            project.plates.length.should.equal(1);
            done();
        });
        it('should be able to generate 3 empty plates from specifying 200 samples', function(done) {
            //--two with 96 samples and one with 8--
            var req = {query: {}};
            req.project = project;
	    req.query.numberOfSamples = 200;
            projects.generatePlateTemplate(req);
            project.plates.length.should.equal(3);
	    done();
        });
    });

    after(function(done){
        Customer.remove().exec();
        Organisms.remove().exec();
        done();
    });

    afterEach(function(done) {
        Project.remove().exec();
        done();
    });
});
