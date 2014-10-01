'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
  species = require('../../app/controllers/species');

module.exports = function(app) {
  // Specie Routes
  app.route('/species')
  .get(species.list)
  .post(users.requiresLogin, species.create);

  app.route('/species/:specieId')
    .get(species.read)
    .put(users.requiresLogin, species.hasAuthorization, species.update)
    .delete(users.requiresLogin, species.hasAuthorization, species.delete);

  // Finish by binding the specie middleware
  app.param('specieId', species.specieByID);
};
