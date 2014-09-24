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
	id: Number,
	name: String
});

mongoose.model('Species', SpeciesSchema);
