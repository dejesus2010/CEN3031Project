'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	due: {
		type: Date,
		default: Date.now // We don't want this to be due 'Now', this is just a place holder
	},
	projectCode: {
		type: String,
		default: '',
		trim: true,
		required: 'Project Code cannot be blank, always in format (ABC_010203)'
	},
	customerCode: {
		type: String,
		default: '',
		required: 'Customer Code cannot be blank, always in format (ABC_010203)'
	},
	species: {
		type: String,
		default: '',
		trim: true,
		required: 'Species'
	},
	customerDescription: {
		type: String,
		default: '',
		trim: true,
		required: 'Customer Description'
	},
	numSamples: {
		type: Number,
		default: 0,
	},
	numPlates: {
		type: Number,
		default: 0,
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Project', ProjectSchema);
