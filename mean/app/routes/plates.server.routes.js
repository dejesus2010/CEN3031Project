'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
  plates = require('../../app/controllers/plates');

module.exports = function(app) {
  // List of all plates
  app.route('/plates')
    .get(plates.list)
    .post(users.requiresLogin, plates.create);

  // List of all assigned plates
  app.route('/plates/assigned')
    .get(users.requiresLogin, plates.listAssigned);

  // List of all unassigned plates
  app.route('/plates/unassigned')
    .get(users.requiresLogin, plates.listUnassigned);

  app.route('/plates/userPlates')
    .get(users.requiresLogin, plates.platesByUser);

  app.route('/plates/assignPlate')
    .post(plates.hasAuthorization, plates.assignPlate);

  app.route('/plates/unassignPlate')
    .post(plates.hasAuthorization, plates.unassignPlate);

  app.route('/plates/:plateId')
    .get(plates.read)
    .put(users.requiresLogin, plates.hasAuthorization, plates.update)
    .delete(users.requiresLogin, plates.hasAuthorization, plates.delete);

  app.route('/numberOfPlatesAssignedToUser')
    .get(users.requiresLogin, plates.numberOfPlatesAssignedToUser);

  app.route('/plates/increment/')
    .post(plates.hasAuthorization, plates.incrementStep);

  app.route('/plates/decrement/')
    .post(plates.hasAdminAuthorization, plates.decrementStep);

  app.route('/plates/reset/')
  	.post(plates.hasAdminAuthorization, plates.resetPlate);
  // Finish by binding the plate middleware
  app.param('plateId', plates.plateByID);
};
