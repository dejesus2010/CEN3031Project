'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Organisms Schema
 */
var SpecieSchema = new Schema({
  id: {
    type: Number,
    default: 0,
    required: 'Organism id must be specified'
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Organism name must not be blank'
  }
});

mongoose.model('Organism', SpecieSchema);
