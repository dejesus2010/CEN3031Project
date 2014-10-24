'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
  organisms = require('../../app/controllers/organisms');

module.exports = function(app) {
  // Organism Routes
  app.route('/organisms')
  .get(organisms.list)
  .post(users.requiresLogin, organisms.create);

  app.route('/organisms/:specieId')
    .get(organisms.read)
    .put(users.requiresLogin, organisms.hasAuthorization, organisms.update)
    .delete(users.requiresLogin, organisms.hasAuthorization, organisms.delete);

  // Finish by binding the organism middleware
  app.param('specieId', organisms.specieByID);
};
