'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Species Schema
 */
var SpeciesSchema = new Schema({
  id: {
    type: Number,
    default: 0,
    required: 'Species id must be specified'
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Species name must not be blank'
  }
});

mongoose.model('Species', SpeciesSchema);
