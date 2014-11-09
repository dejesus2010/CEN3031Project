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
  },
  projects: [{
  	type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  email: {
  	type: String,
  	default: '',
  	trim: true,
    validate: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  	required: 'Customer must have a contact e-mail address'
  }
});

mongoose.model('Customer', CustomerSchema);
