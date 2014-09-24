'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Sample Schema
 */
var SampleSchema = new Schema({
	data: [Number]
});

mongoose.model('Sample', SampleSchema);
