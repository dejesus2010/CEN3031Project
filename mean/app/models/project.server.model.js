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
		default: null, // We don't want this to be due 'Now', this is just a place holder
		required: 'Projects must specify a due date'
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
	customer: {
		type: Schema.ObjectId,
		ref: 'Customer',
		required: 'A customer must be specified'
	},
	organism: {
		type: Schema.ObjectId,
		ref: 'Organism',
		required: 'An organism must be specified'
	},
	sequencingMethod: {
		type: String,
		default: '',
		trim: true
	},
	plates: [{
		type: Schema.ObjectId,
		ref: 'Plate',
	}],
	description: {
		type: String,
		default: '',
		trim: true,
		required: 'Project Description is required'
	},
	projectStatus: {
		type: Boolean,
		default: false
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'A user must be specified for the project'
	},
});

mongoose.model('Project', ProjectSchema);
