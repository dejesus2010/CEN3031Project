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
	Log = mongoose.model('Log'),
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
	var log = new Log({
		user: req.user,
		timestamp: Date.now(),
		status: 'Updating plate'
	});

	log.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			plate.logs.push(log._id);
			plate.save(function(err) {
				if (err) {
					Log.remove({id: log._id}).exec();
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(plate);
				}
			});
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
	Plate.find().lean().sort({stage: 1}).populate('user', 'displayName').populate('assignee', 'displayName').populate('project').exec(function(err, plates) {
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
 * List of all plates which have a user assigned to them
 */
exports.listAssigned = function(req, res) {
	Plate.find({isAssigned: true}).lean().sort({stage: 1}).populate('user', 'displayName').populate('assignee', 'displayName').populate('project').exec(function(err, plates) {
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
 * List of all plates which do not have a user assigned to them
 */
exports.listUnassigned = function(req, res) {
	Plate.find({isAssigned: false}).lean().sort({stage: 1}).populate('user', 'displayName').populate('assignee', 'displayName').populate('project').exec(function(err, plates) {
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
		} else if (plate === null) {
			return res.status(404).send({
				message: 'Plate not found'
			});
		} else if(req.body.isAssigned) {
			return res.status(409).send({
				message: 'Plate is already assigned'
			});
		}
		var assignee;
		// Allows an admin to assign a plate to a user
		if(req.body.assignee === null) {
			assignee = req.user._id;
		} else {
			assignee = req.body.assignee._id;
		}
		var log = new Log({
			user: req.user,
			timestamp: Date.now(),
			status: 'Assigning plate: ' + plate.plateCode + ' to user: ' +	assignee
		});
		plate.assignee = assignee;
		plate.isAssigned = true;
		log.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				plate.logs.push(log._id);
				plate.save(function(err) {
					if (err) {
						Log.remove({id: log._id}).exec();
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(plate);
					}
				});
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
		var log = new Log({
			user: req.user,
			timestamp: Date.now(),
			status: 'Unassigning plate: ' + plate.plateCode + ' to user: ' + plate.assignee
		});
		log.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				plate.logs.push(log._id);
		        plate.save(function(err) {
		            if (err) {
		            	Log.remove({id: log._id}).exec();
		                return res.status(400).send({
		                    message: errorHandler.getErrorMessage(err)
		                });
		            } else {
		                res.jsonp(plate);
		            }
		        });
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
/*
Return number of plates assigned to user
 */
exports.numberOfPlatesAssignedToUser = function(req, res){
	var userId = req.user._id;

	Plate.find({assignee: userId}).exec(function(err, doc) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(doc.length);
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
	User.findOne({_id: req.user._id}).exec(function(err, user) {
        if (err) {
            return next(err);
        }
        //not using req.body.assignee !== req.user._id b/c !== causes type check to fail and say they're not equal when thy are equal values
        //switchd to .contains b/c user.roles = list
		else if (req.body.isAssigned && req.body.assignee !== null && req.body.assignee != req.user._id && !(_.contains(user.roles,'admin'))) { // jshint ignore:line
			return res.status(403).send('User is not authorized');
		}
		next();
	});
};
