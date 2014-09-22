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
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Project', ProjectSchema);
