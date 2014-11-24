exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['public/protractor_tests/*test.js'],
    baseUrl: 'http://localhost:9001',

    onPrepare: function() {
    	browser.manage().timeouts().pageLoadTimeout(40000);
	browser.manage().timeouts().implicitlyWait(25000);
	browser.ignoreSynchronization = true;
    }
};
