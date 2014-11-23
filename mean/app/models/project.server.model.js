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
	lastEditor: {
		type: Schema.ObjectId,
		ref: 'User',
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
	logs: [{
		type: Schema.ObjectId,
		ref: 'Log'
	}]
});

//create a hook that intercepts a remove and deletes all plates before the project is deleted
ProjectSchema.pre('remove', function(next){
    //find all plates belonging to this project
    this.model('Plate').find({_id: {$in: this.plates}},function(err, docs){
        if(err) {
            console.log('Failed to find nested plates: ' + err);
        } else {
            //loop over every plate in the project
            //we must find & loop this way because...
            for(var doc in docs){
                console.log(docs[doc]);
                //...it allows us to use a mongoose remove command [below]
                //which will successfully trigger the pre-remove middleware
                //on the plate objects. a direct remove w/ query conditions
                //would not trigger the middleware.
                docs[doc].remove();
            }
        }
    });
    next();
});

mongoose.model('Project', ProjectSchema);
