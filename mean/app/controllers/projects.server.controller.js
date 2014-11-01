'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Project = mongoose.model('Project'),
	Log = mongoose.model('Log'),
	_ = require('lodash'),
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
	console.log('Project code : ' + project.projectCode);
	var newArray = java.newArray('java.lang.String', [project.projectCode, './temp/plate_layouts', project.description, '96']);
	java.callStaticMethodSync('com.rapidgenomics.GUIPrepareSpreadsheetWriter', 'main', newArray);
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
	Project.findById(id).populate('user', 'displayName').populate('lastEditor').populate('customer').populate('organism').exec(function(err, project) {
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
