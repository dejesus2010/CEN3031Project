'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Plate Schema
 */
var PlateSchema = new Schema({
  plateCode: {
    type: String,
    trim: true,
    required: 'Plate code must be specified'
  },
  stage: {
    type: Number,
    default: 1
  },
  project: {
    type: Schema.ObjectId,
    ref: 'Project',
    required: 'Plate must belong to a project'
  },
  samples: [{
    type: Schema.Types.ObjectId,
    ref: 'Sample'
  }],
  assignee: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  isAssigned: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Plate', PlateSchema);
