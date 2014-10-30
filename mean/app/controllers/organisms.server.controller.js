'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Organism = mongoose.model('Organism'),
  _ = require('lodash');

/**
 * Create an organism
 */
exports.create = function(req, res) {
  var organism = new Organism(req.body);
  organism.user = req.user;

  organism.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organism);
    }
  });
};

/**
 * Show the current organism
 */
exports.read = function(req, res) {
  res.jsonp(req.organism);
};

/**
 * Update an organism
 */
exports.update = function(req, res) {
  var organism = req.organism;

  organism = _.extend(organism, req.body);

  organism.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organism);
    }
  });
};

/**
 * Delete an organism
 */
exports.delete = function(req, res) {
  var organism = req.organism;

  organism.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organism);
    }
  });
};

/**
 * List of Organisms
 */
exports.list = function(req, res) {
  Organism.find().sort('-created').populate('user', 'displayName').exec(function(err, organisms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organisms);
    }
  });
};

/**
 * Organism middleware
 */
exports.organismByID = function(req, res, next, id) {
  Organism.findById(id).populate('user', 'displayName').exec(function(err, organism) {
    if (err) return next(err);
    if (!organism) return next(new Error('Failed to load organism ' + id));
    req.organism = organism;
    next();
  });
};

/**
 * Organism authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.organism.user.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
