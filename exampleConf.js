'use strict';

// custom reporter
var customReporter 		= require('./reporter/main.js');	

var TIME_OUT  = 100000 // General wait (ms)					// required [todo fix bug]
var BASE_URL  = 'http://eloquentjavascript.net/'			// required

var reportPath			= "C:/exampleDirectory/"			// required
var downloadPath		= "C:/example/folder/structure/"	// optional
var applicationName     = "test2"							// required
var generateHTML        = true;								// optional
var generateJSON        = true;								// optional



var reporterConfig ={
			application_name   : applicationName,
			application_url    : BASE_URL,
			simple_html_report : generateHTML,
			json_report		   : generateJSON
		};
		
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
				// TODO next version [auto download to attachment folder]
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
		// stop Synchronization
		browser.ignoreSynchronization = true;
		// add customer reporter
		jasmine.getEnv().addReporter(new customReporter(reporterConfig));
    }, // ends on prepare 
		jasmineNodeOpts: {
		// Stop default dot reporter from printing
		print: function() {}
	}
	
} 