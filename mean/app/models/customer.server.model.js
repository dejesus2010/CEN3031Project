'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Customer name must be specified'
  },
  id: {
    type: Number,
    default: 0,
    required: 'Customer id must be specified'
  },
  code: {
    type: String,
    default: '',
    required: 'Customer code cannot be blank, always in format (ABC)'
  }
});

mongoose.model('Customer', CustomerSchema);
