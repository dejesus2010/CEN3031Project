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
  plateCode: Number,
  stage: Number,
  project: {
    type: Schema.ObjectId,
    ref: 'Project'
  },
  samples: [{
    type: Schema.Types.ObjectId,
    ref: 'Sample'
  }]
});

mongoose.model('Plate', PlateSchema);
