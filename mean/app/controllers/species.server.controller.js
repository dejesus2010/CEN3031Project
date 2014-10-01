'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Specie = mongoose.model('Specie'),
  _ = require('lodash');

/**
 * Create a specie
 */
exports.create = function(req, res) {
  var specie = new Specie(req.body);
  specie.user = req.user;

  specie.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(specie);
    }
  });
};

/**
 * Show the current specie
 */
exports.read = function(req, res) {
  res.jsonp(req.specie);
};

/**
 * Update a specie
 */
exports.update = function(req, res) {
  var specie = req.specie;

  specie = _.extend(specie, req.body);

  specie.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(specie);
    }
  });
};

/**
 * Delete an specie
 */
exports.delete = function(req, res) {
  var specie = req.specie;

  specie.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(specie);
    }
  });
};

/**
 * List of Species
 */
exports.list = function(req, res) {
  Specie.find().sort('-created').populate('user', 'displayName').exec(function(err, species) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(species);
    }
  });
};

/**
 * Specie middleware
 */
exports.specieByID = function(req, res, next, id) {
  Specie.findById(id).populate('user', 'displayName').exec(function(err, specie) {
    if (err) return next(err);
    if (!specie) return next(new Error('Failed to load specie ' + id));
    req.specie = specie;
    next();
  });
};

/**
 * Specie authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.specie.user.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
