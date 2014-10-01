'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
  customers = require('../../app/controllers/customers');

module.exports = function(app) {
  // Customer Routes
  app.route('/customers')
  .get(customers.list)
  .post(users.requiresLogin, customers.create);

  app.route('/customers/:customerId')
    .get(customers.read)
    .put(users.requiresLogin, customers.hasAuthorization, customers.update)
    .delete(users.requiresLogin, customers.hasAuthorization, customers.delete);

  // Finish by binding the customer middleware
  app.param('customerId', customers.customerByID);
};
