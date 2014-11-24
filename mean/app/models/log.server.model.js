'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Log Schema
 */
var LogSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: 'A user must be specified for the log'
  },
  timestamp: {
    type: Date,
    required: 'A timestamp must be specified for the log'
  },
  status: {
    type: String,
    default: ''
  }
});

mongoose.model('Log', LogSchema);