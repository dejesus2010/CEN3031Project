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
			required: 'A species must have an id: i.e. 123'
	},
	name: {
			type: String,
			required: 'A species must have a name'
	}

});

mongoose.model('Species', SpeciesSchema);
