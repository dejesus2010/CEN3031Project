'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Plate = mongoose.model('Plate'),
	Customer = mongoose.model('Customer'),
	Organism = mongoose.model('Organism'),
	User = mongoose.model('User'),
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
	var plate = req.plate;

	plate = _.extend(plate, req.body);

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
	var plate = req.plate;

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
 * List of all plates
 */
exports.list = function(req, res) {
	Plate.find().lean().sort('-created').populate('user', 'displayName').populate('assignee', 'displayName').populate('project').exec(function(err, plates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
				Customer.populate(plates, {path: 'project.customer'}, function(err, doc) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					Organism.populate(doc, {path: 'project.organism'}, function(err, doc) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							res.jsonp(doc);
						}
					});
				}
			});
		}
	});
};

/**
 * Assigns a specific plate to a user. If req.body.assignee is defined, the plate can be assigned
 * on behalf of a user given the request is done by an admin user.
 */
exports.assignPlate = function(req, res) {
	Plate.findOne({_id: req.body._id}).exec(function(err, plate) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		if(req.body.isAssigned) {
			return res.status(409).send({
				message: 'Plate is already assigned'
			});
		}
		var assignee;
		// Allows an admin to assign a plate to a user
		if(req.body.assignee === undefined) {
			assignee = req.user._id;
		} else {
			assignee = req.body.assignee._id;
		}
		plate.assignee = assignee;
		plate.isAssigned = true;
		plate.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(plate);
			}
		});
	});
};

exports.unassignPlate = function(req, res) {
	Plate.findOne({_id: req.body._id}).exec(function(err, plate) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		if(!req.body.isAssigned) {
			return res.status(409).send({
				message: 'Plate is already unassigned'
			});
		}
		plate.assignee = null;
		plate.isAssigned = false;
		plate.remove(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(plate);
			}
		});
	});
};

/**
 * List of a user's assigned plates
 */
exports.platesByUser = function(req, res) {
	var userId = req.user._id;

	Plate.find({assignee: userId}).populate('samples').populate('project').exec(function(err, doc) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Customer.populate(doc, {path: 'project.customer'}, function(err, doc) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					Organism.populate(doc, {path: 'project.organism'}, function(err, doc) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							res.jsonp(doc);
						}
					});
				}
			});
		}
	});
};

/**
 * Plate middleware
 */
exports.plateByID = function(req, res, next, id) {
	Plate.findById(id).populate('user', 'displayName').exec(function(err, plate) {
		if (err) return next(err);
		if (!plate) return next(new Error('Failed to load Plate ' + id));
		req.plate = plate;
		next();
	});
};

/**
 * Plate authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	User.findOne({_id: req.user.id}).exec(function(err, user) {
		if (err) {
			return next(err);
		} else if (req.body.isAssigned && req.body.assigned.id !== req.user.id && user.roles !== 'admin') {
			return res.status(403).send('User is not authorized');
		}
		next();
	});
};