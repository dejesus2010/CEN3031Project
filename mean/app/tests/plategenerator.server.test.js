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
    User = mongoose.model('User');

/**
 * Globals
 */
var project;

/**
 * Unit tests
 */
/*
describe('Plate Generator Unit Tests:', function() {
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

    describe('PlateGenerator', function() {
       it('should be able to generate 1 plate from Sample_Layout_1.xlsx', function(done) {
            // with 10 samples
            var req = {};
            req.project = project;
            req.whichFile = 'Sample_Layout_1.xlsx';
            projects.generatePlates(req);
            project.plates.length.should.equal(1);
            //project.plates[0].name.should.equal('ABC_010203_P1');
            done();
        });
        it('should be able to generate 1 plate from Sample_Layout_2.xlsx', function(done) {
            //with 96 samples
            var req = {};
            req.project = project;
            req.whichFile = 'Sample_Layout_2.xlsx';
            projects.generatePlates(req);
            project.plates.length.should.equal(1);
            done();
        });
        it('should be able to generate 3 plates from Sample_Layout_3.xlsx', function(done) {
            //--two with 96 samples and one with 8--
            var req = {};
            req.project = project;
            req.whichFile = 'Sample_Layout_3.xlsx';
            projects.generatePlates(req);
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
});*/
