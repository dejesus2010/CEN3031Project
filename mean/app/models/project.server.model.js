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
	lastEdited: {
		type: Date,
		default: Date.now 
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
		required: 'Customer Code cannot be blank, always in format (ABC)'
	},
	species: {
		type: String,
		default: '',
		trim: true,
		required: 'Species'
	},
	description: {
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
	projectStatus: {
		type: Boolean,
		default: false,
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	speciesId: Number,	
	customerId: Number	
});

mongoose.model('Project', ProjectSchema);
