'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Species Schema
 */
var SpecieSchema = new Schema({
  id: {
    type: Number,
    default: 0,
    required: 'Specie id must be specified'
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Specie name must not be blank'
  }
});

mongoose.model('Specie', SpecieSchema);
