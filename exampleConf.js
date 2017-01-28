'use strict';

var TIME_OUT  = 100000 // General wait (ms)
var BASE_URL  = 'www.google.com'
// HTML reporter
var customReporter 		= require('./reporter/main.js');
var reportPath			= "C:/exampleDirectory/"
var downloadPath		= "C:\\example\\folder\\structure\\"

exports.config = {
	framework: 'jasmine',
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: [
		'exampleSpec.js',														   // Runs all test files in this array
	],
	exclude: [
	],
	capabilities: {
		browserName: 'chrome',														// Browser to test on -> firefox for firefox / chrome for chrome
		shardTestFiles: false,														// When max instances is higher than 1, the specs will be devided over the selenium instances
		maxInstances: 1,															// Starts up 2 selenium servers
		'chromeOptions': {
				// Get rid of --fignore-certificate yellow warning
				args: ['--no-sandbox', '--test-type=browser'],
				// Set download path and avoid prompting for download even though
				// this is already the default on Chrome but for completeness
				// even though this does not do what we want right now...
				prefs: {
					'download':
					 {
						downloadPath,
					},
				},
			},
	},
	
	onPrepare: function() {

/*
*		Fixtures test modules
*/
		global.robotFixture 				       = require('./fixtures/tests/robotFixture.js').robotFixture;

/*
*		Global shortcut refferences
*/
		global.baseUrl 				= BASE_URL;
		global.downloadPath			= downloadPath;
		global.reportPath			= reportPath;

/*
*		Holds current URL for reporting   [[TODO  Replace functionality]]
*/
		global.currentURL 			= "";


/*
*			Reporting
*/

		browser.ignoreSynchronization = true;
		// add customer reporter
		jasmine.getEnv().addReporter(new customReporter({
			application_name   : "RobotJsHelperModule TestDUMMY",
			application_url    : BASE_URL,
			simple_html_report : true
		}));
    }, // ends on prepare 
		jasmineNodeOpts: {
		// Stop default dot reporter from printing
		print: function() {}
	}
	
} 