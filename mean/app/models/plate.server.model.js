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
	numSamples: Number,
	plateNumber: Number,	
	project: Schema.ObjectId,
	ref: 'Project'
});

mongoose.model('Plate', PlateSchema);
