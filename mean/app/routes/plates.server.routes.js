'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
  plates = require('../../app/controllers/plates');

module.exports = function(app) {
  // plate Routes
  app.route('/plates')
    .get(plates.list)
    .post(users.requiresLogin, plates.create);

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

  // Finish by binding the plate middleware
  app.param('plateId', plates.plateByID);
};
