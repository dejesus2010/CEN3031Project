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
    sampleCode: {
        type: String,
        required: 'Sample code must be specified'
    },
    volume: { //units of uL
        type: Number,
        required: 'Sample volume must be specified'
    },
    concentration: { //units of ng/uL
        type: Number,
        required: 'Sample volume must be specified'
    },
    totalDNA: { //units of ng
        type: Number,
        required: 'Sample volume must be specified'
    }
});

mongoose.model('Sample', SampleSchema);
