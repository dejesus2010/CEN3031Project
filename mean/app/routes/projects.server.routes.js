'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	projects = require('../../app/controllers/projects');

module.exports = function(app) {
	// Project Routes
	app.route('/projects')
	    .get(users.requiresLogin, projects.list)
	    .post(users.requiresLogin, projects.create);

	app.route('/projects/:projectId')
		.get(projects.read)
		.put(users.requiresLogin, projects.hasAuthorization, projects.update)
		.delete(users.requiresLogin, projects.hasAuthorization, projects.delete);

    	app.route('/projects/:projectId/GeneratePlateTemplate')
		.post(users.requiresLogin, projects.generatePlateTemplate);

    	app.route('/projects/:projectId/GeneratePlates')
		.post(users.requiresLogin, projects.generatePlates);

    	app.route('/projects/:projectId/UploadPlateLayout')
		.post(users.requiresLogin, projects.uploadPlateLayout);

	app.route('/projectsByStatus/:projectStatus')
		.get(users.requiresLogin, projects.listOfProjectsByStatus);

	// Finish by binding the project middleware
	app.param('projectId', projects.projectByID);
};
