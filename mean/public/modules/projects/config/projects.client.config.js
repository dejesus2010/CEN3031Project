'use strict';

// Configuring the Projects module
angular.module('projects', ['worklist']).run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Projects', 'projects', 'dropdown', '/projects(/create)?');
		Menus.addSubMenuItem('topbar', 'projects', 'List Projects', 'projects');
		Menus.addSubMenuItem('topbar', 'projects', 'New Project', 'projects/create');
	}
]);
