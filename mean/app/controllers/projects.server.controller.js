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
	path = require('path'),
	fs = require('fs'),
	nodemailer=require('nodemailer'),
	sys = require('sys'),
	exec = require('child_process').exec,
	multiparty = require('multiparty'),
	util = require('util'),
	http = require('http'),
	uuid = require('node-uuid');

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
	var args = project.projectCode + ' app/tmp/plate_layouts \"' + project.description + '\" ' + numberOfSamples;
    	var command = 'java -jar app/bin/PrepareSummarySpreadsheet.jar ' + args;
    	exec(command, function(error, stdout, stderr){
		if(error){
		    sys.puts('Encountered an error when trying to create plate layout for ' + project.projectCode + ' using: \n' + command);
		    sys.puts(stderr);
		    sys.puts(error);
		}
		else{
		    sys.puts('Successfully created ' + project.projectCode  + '.xlsx');
		    exports.emailPlateLayout(req);
		    fs.unlink('app/tmp/plate_layouts/' + project.projectCode + '_Plate_Layout.xlsx', function(err){if(err){console.log(err);}});
		}
	});

	var logPlateErr = function(err){
		if(err){
		    console.log(errorHandler.getErrorMessage(err));
		}
	};

	var numberOfPlates = parseInt(numberOfSamples / 96) + 1;
	for(var i = 1; i <= numberOfPlates; ++i) {
		var plate = new Plate();
		plate.user = req.user;
		plate.users.push(req.user);
		if (i < 10) {
			plate.plateCode = project.projectCode + '_P0' + i;
		}
		else {
			plate.plateCode = project.projectCode + '_P' + i; 
		}
		plate.project = project;
		project.plates.push(plate);
		plate.save(logPlateErr);
	}
	project.save(function(err){
		if(err){
		    console.log(project);
		    console.log(errorHandler.getErrorMessage(err));
		}
	});
};

exports.emailPlateLayout = function(req) {
    var project = req.project;
    var password = fs.readFileSync('app/secure/password.txt');
    var transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'jliccini@rapid-genomics.com',
            pass: password
        }
    });
    var mailOptions = {
        from: 'Joseph Liccini <jliccini@rapid-genomics.com>',
        to: project.customer.email,
        subject: 'Your RAPiD Genomics Plate Layout is ready!',
        text: 'Attached is your plate layout.',
        attachments: [
            {
                path: 'app/tmp/plate_layouts/' + project.projectCode + '_Plate_Layout.xlsx'
            }
        ]
    };
    transport.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Failed to send email to ' + project.customer.email + '.\n' + error);
        } else {
            console.log('Successfully sent email to ' + project.customer.email + '.\n' + info.response);
        }
    });
};

exports.generatePlates = function(req){
    console.log('we are in generatePlates');
    var project = req.project;
    //var fn = req.whichFile;
    var fn = 'app/tmp/plate_layouts/' + project.projectCode + '.xlsx';
    var plateWorkbook = xlsx.readFile(fn);
    var workSheet = plateWorkbook.Sheets[plateWorkbook.SheetNames[0]];
    var data = xlsx.utils.sheet_to_json(workSheet);
    var index = 0;
    var logSampleErr = function(err) {
        if (err) {
            console.log(curSample);
            console.log(errorHandler.getErrorMessage(err));
        }
    };
    var logPlateErr = function(err){
        if(err){
            console.log(curPlate);
            console.log(errorHandler.getErrorMessage(err));
        }
    };

    var plateIndex = 0;
    while(index < data.length){
    	var curPlate = project.plates[plateIndex];
	console.log('CurPlate: ' + curPlate);
        for(var i = 0; i < 96 && index < data.length; ++i){
            var propNum = 1;
            var row = data[index];
            var curSample = new Sample();
	    if (i < 10) {
		    curSample.sampleCode = curPlate.plateCode + '_W' + String.fromCharCode(65 + parseInt(i/12,10)) + '0' + (parseInt(i%12,10) + 1); 
	    }
	    else {
		    curSample.sampleCode = curPlate.plateCode + '_W' + String.fromCharCode(65 + parseInt(i/12,10)) + (parseInt(i%12,10) + 1); 
	    }
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
            curSample.save(logSampleErr);
            curPlate.samples.push(curSample);
            ++index;
        }
	++plateIndex;
	curPlate.save(logPlateErr);
    }

    project.save(function(err){
        if(err){
            console.log(project);
            console.log(errorHandler.getErrorMessage(err));
        }
    });
};

exports.uploadPlateLayout = function(req, res) {
	console.log('here, trying to upload a plate layout');
	var project = req.project;
	var form = new multiparty.Form({
		uploadDir: 'app/tmp'
	});

	form.parse(req, function(err, fields, files) {
		var file = files.file[0];
		var contentType = file.headers['content-type'];
		var tmpPath = file.path;

		var fileName = project.projectCode + '.xlsx';
		//var destPath = path.join(__dirname, '../tmp/' + fileName);
		var destPath = 'app/tmp/plate_layouts/' + fileName;

		console.log('ContentType: ' + contentType);

		fs.rename(tmpPath, destPath, function(err) {
			if (err) {
				console.log(err);
				return res.status(400).send('plate layout did not save');
			}
			return res.json(destPath);
		});

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

exports.listOfProjectsByStatus = function(req, res){
    Project.find({'projectStatus': req.params.projectStatus}).populate('customer').populate('organism').populate('lastEditor').sort('-created').exec(function(err, projects) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projects);
        }
    });
};
