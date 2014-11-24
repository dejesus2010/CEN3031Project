'use strict';

describe('Protractor test for Login and Project Creation', function() {
	it('should successfully login, and create a new project, then delete that project', function() {

		// We will sign up.
		/*browser.get('localhost:3000/#!/signup');
		element(by.id('firstName')).sendKeys('Tim');
		element(by.id('lastName')).sendKeys('Tebow');
		element(by.id('email')).sendKeys('heisman@ufl.edu');
		element(by.id('username')).sendKeys('tim.tebow');
		element(by.id('password')).sendKeys('football');*/

		browser.get('localhost:3000/#!/');
		// We will sign in.
		element(by.id('signInButton')).click();

		// We will enter a username and password
		element(by.model('credentials.username')).sendKeys('joseph.liccini');
		element(by.model('credentials.password')).sendKeys('hypomangen0228').submit();

		// We will view our projects.
		element(by.id('projectDropdownMenu')).click();

		element.all(by.repeater('subitem in item.items')).get(1).click();
		
		element(by.id('createCustomerButton')).click();
		element(by.id('name')).sendKeys('TestCustomer');
		element(by.id('code')).sendKeys('TTT');
		element(by.id('email')).sendKeys('joseph.liccini@live.com');
		element(by.id('submitButton')).click();

		element(by.id('createOrganismButton')).click();
		element(by.id('name')).sendKeys('TestOrganism');
		element(by.id('submitButton')).submit();

		element(by.id('selectCustomer')).click();
		element(by.id('TestCustomer')).click();

		element(by.id('selectOrganism')).click();
		element(by.id('TestOrganism')).click();

		element(by.id('datePickerInput')).sendKeys('28-November-2014');
		element(by.id('description')).sendKeys('This is a test description!\nMEAN js ROX my SOX!').submit();
		browser.sleep(2000);
		element(by.id('deleteProjectButton')).click();
		element(by.id('confirmDeleteButton')).click();

		browser.sleep(2000);
	});
});
