'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Project = mongoose.model('Project'),
	Log = mongoose.model('Log'),
    Plate = mongoose.model('Plate'),
    Sample = mongoose.model('Sample'),
	_ = require('lodash'),
    xlsx = require('xlsx'),
	java = require('java'),
	path = require('path'),
	fs = require('fs');

	/* This is here (outside any function), so that we don't repeatedly add this jar to 
	 * the classpath. */
	java.classpath.push(path.join(__dirname, '../bin/PrepareSummarySpreadsheet.jar'));

/**
 * Create a project
 */

exports.create = function(req, res) {
	var log = new Log({
		user: req.user,
		timestamp: Date.now()
	});

	var project = new Project(req.body);
	project.user = req.user;
	project.lastEditor = req.user;
  log.save(function(err, doc) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        log._id = doc._id;
        project.logs = [log._id];
        project.save(function(err) {
          if (err) {
            log.remove(function(err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            });
          } else {
            res.jsonp(project);
          }
        });
      }
  });
};

exports.generatePlateTemplate = function(req){
	var project = req.project;
	var numberOfSamples = req.query.numberOfSamples;
	console.log('Plate layout for ' + project.projectCode);
	console.log('EXPRESS: number of samples: ' + numberOfSamples);
	var newArray = java.newArray('java.lang.String', [project.projectCode, './temp/plate_layouts', project.description, numberOfSamples]);
	java.callStaticMethodSync('com.rapidgenomics.GUIPrepareSpreadsheetWriter', 'main', newArray);
};

exports.generatePlates = function(req){
    var project = req.project;
    var fn = req.whichFile;
    var plateWorkbook;
    if(fn != undefined){
        plateWorkbook = xlsx.readFile('app/tmp/' + fn);
    }
    else {
        plateWorkbook = xlsx.readFile('app/tmp/Sample_Layout_3.xlsx');
    }
    var workSheet = plateWorkbook.Sheets[plateWorkbook.SheetNames[0]];
    var data = xlsx.utils.sheet_to_json(workSheet);
    var index = 0;
    while(index < data.length){
        var curPlate = new Plate();
        curPlate.plateCode = project.projectCode + '_P' + (index/96 + 1); //bug if <= 9 for format
        curPlate.project = project;
        for(var i = 0; i < 96 && index < data.length; ++i){
            var propNum = 1;
            var row = data[index];
            var curSample = new Sample();
            curSample.sampleCode = curPlate.plateCode + '_W' + String.fromCharCode(65 + parseInt(i/12,10)) + (parseInt(i%12,10) + 1); //bug if <= 9 for format
            for(var key in row){
                if(propNum === 6){ //volume
                    curSample.volume = row[key];
                } else if(propNum === 8){ //concentration
                    curSample.concentration = row[key];
                } else if(propNum === 9) { //DNA
                    curSample.totalDNA = row[key].replace(',','');
                }
                ++propNum;
            }
            curSample.save(function(err) {
                if (err) {
                    console.log(curSample);
                    console.log(errorHandler.getErrorMessage(err));
                }
            });
            curPlate.samples.push(curSample);
            ++index;
        }
        curPlate.save(function(err){
            if(err){
                console.log(curPlate);
                console.log(errorHandler.getErrorMessage(err));
            }
        });
        project.plates.push(curPlate);
    }
    project.save(function(err){
        if(err){
            console.log(project);
            console.log(errorHandler.getErrorMessage(err));
        }
    });
};

/**
 * Show the current project
 */
exports.read = function(req, res) {
	res.jsonp(req.project);
};

/**
 * Update a project
 */
exports.update = function(req, res) {
	var project = req.project;

	project = _.extend(project, req.body);
	project.lastEditor = req.user;
	project.lastEdited = Date.now();

	var log = new Log({
		user: req.user,
		timestamp: Date.now()
	});

  log.save(function(err, doc) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        log._id = doc._id;
        project.logs.push(log._id);
        project.save(function(err) {
          if (err) {
            log.remove(function(err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            });
          } else {
            res.jsonp(project);
          }
        });
      }
  });
};

/**
 * Delete an project
 */
exports.delete = function(req, res) {
	var project = req.project;

	project.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
	Project.find().populate('customer').populate('organism').populate('lastEditor').sort('-created').exec(function(err, projects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projects);
		}
	});
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) {
	Project.findById(id).populate('user', 'displayName').populate('lastEditor').populate('customer').populate('organism').populate('plates').exec(function(err, project) {
		if (err) return next(err);
		if (!project) return next(new Error('Failed to load project ' + id));
		req.project = project;
		next();
	});
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.project.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
