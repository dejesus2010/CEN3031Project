'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Plate = mongoose.model('Plate'),
	_ = require('lodash');

/**
 * Create a Plate
 */
exports.create = function(req, res) {
	var plate = new Plate(req.body);
	plate.user = req.user;

	plate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plate);
		}
	});
};

/**
 * Show the current Plate
 */
exports.read = function(req, res) {
	res.jsonp(req.plate);
};

/**
 * Update a Plate
 */
exports.update = function(req, res) {
	var plate = req.plate ;

	plate = _.extend(plate , req.body);

	plate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plate);
		}
	});
};

/**
 * Delete an Plate
 */
exports.delete = function(req, res) {
	var plate = req.plate ;

	plate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plate);
		}
	});
};

/**
 * List of Plates
 */
exports.list = function(req, res) { Plate.find().sort('-created').populate('user', 'displayName').exec(function(err, plates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plates);
		}
	});
};

/**
 * Plate middleware
 */
exports.plateByID = function(req, res, next, id) { Plate.findById(id).populate('user', 'displayName').exec(function(err, plate) {
		if (err) return next(err);
		if (! plate) return next(new Error('Failed to load Plate ' + id));
		req.plate = plate ;
		next();
	});
};

/**
 * Plate authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.plate.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};