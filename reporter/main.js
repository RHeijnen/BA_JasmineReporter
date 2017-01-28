module.exports             = myReporter;

var simpleReport           = require('./simpleReport.js');
var jsonReport             = require('./jsonReport.js');
var fileStructureLogic     = require('./fileStructureLogic.js');
var angularReport          = require('./angularReport.js');

var fs                     = require("../node_modules/promised-io/fs");
var q                      = require('../node_modules/promised-io/promise');


var date 		           = new Date();
var imageIncrement         = 0;
var filepath               = "./JsonReports/images/"
var currentUrl             = " ";

var timer;          
var testTimer;
var suiteTimer;

var reportObject = {
					"Application_Name"   : "__do_not_forget_filename_parameter__",
                    "Application_Version": undefined, 
                    "Application_Build"  : undefined, 
                    "Application_URL"    : undefined,
                    "Test_Date"          : date.toDateString().replace(/T/, ' ').replace(/\..+/, ''), //.toDateString(),
                    "Test_Duration"      : " ",
                    "Total_Specs"        : " ",
                    "Total_Expectations" : " ",
                    "Total_Expectations_Passed" : " ",
                    "Total_Expectations_Fail"   : " ",
                    "Total_Expectations_Percentage" : " ", 
                    "Test_Results":[
						
                        // the reports go in here
                    ]   
};

/*
*   Writes object to Json
*       Json Report
*/
function writeJson(_FILENAME){
    if(global.debug){
        console.log("======= Generating Json File ========");
        console.log("json.filename: "+_FILENAME);
        console.log(reportObject);
        console.log("======= /Generating Json File ========");
    };
    jsonReport.writeFile(_FILENAME,reportObject)
};


/*
*    percentage calculation formula for seeing how much  %  passed 
*/
function getPercentage(x,y){
        var percentage;
        var total  = x;
        var passed = y;

        if(isNaN(total) || isNaN(passed)){
            percentage = "null";
            return percentage;
        }else{
            if(passed == 0){
                percentage = 100;
                return percentage;
            }else{
                percentage = ((passed/total) * 100).toFixed(1);
                return percentage;
            }
        }
}

function writeScreenShot(data, filename) {
    /*
    *   takes protractor browser screenshot function to write a screenshot
    */
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
    // increment filename
    imageIncrement++
}

function getBuildNumber(){

    return;
}

function getChangeLog(){

    return;
}

function myReporter(_PARAMETER) {
    // set _Parameter object 
    var _PARAMETER = _PARAMETER || {};
    // sanitize arguments
    reportObject.Application_Name = _PARAMETER.application_name;
    reportObject.Application_URL  = _PARAMETER.application_url;
    htmlReport                    = _PARAMETER.simple_html_report;
    generateJson                    = _PARAMETER.json_report;


    var tempSuiteName             = ""; 
    var totalTestPassedCount      = 0;
    var totalTestFailCount        = 0;
    var suiteTestPassedCount      = 0;
    var suiteTestFailCount        = 0;
    var suiteSpecs                = [];
    var suiteSpecsResults         = [];
    var expectations              = [];



/*
*
*   When jasmine starts, push the ammount of tests we have into our reporter object
*   
*/
    this.jasmineStarted = function(suiteInfo){
        // delete/create folder for screenshots
        fileStructureLogic.createResultFolder(reportObject.Application_Name);
        // get total specs
        reportObject.Total_Specs = suiteInfo.totalSpecsDefined;
        // starts the total test duration timer
        testTimer                = new Date();

    },
/*
*
*   When a suite is started, we reset the temporary variable we have for saving suite details
*   
*
*/    
    this.suiteStarted = function(result){
        suiteTimer = new Date();
        // reset references
        suiteTestPassedCount = 0;
        suiteTestFailCount   = 0;
        tempSuiteName        = "";
        suiteSpecs           = [];
        suiteSpecsResults    = [];
    
        // save the suite description
        tempSuiteName = result.description

    },
/*
*
*   When a spec starts we reset its expectations array and get the current URL
*   
*
*/ 
    this.specStarted = function(result){
        timer                = new Date();
        expectations = [];

        
    },
/*
*
*   When a spec is done, we save its expectations into temp object named expectations,
*   when we are done collecting them we push them into our temporary suite object
*
*/
    this.specDone = function(result){
        // checks howmuch time passed since the spec started
        var elapsedTime = new Date() - timer;
        // increment screenshot name variable
        var screenshotFolder = global.reportPath+reportObject.Application_Name+"/_Screenshots/".replace(" ", "_");        
        var incrementedName = screenshotFolder+ "/"+reportObject.Application_Name+'screenshot';

        // clean up
        incrementedName = incrementedName.replace(" ", "_");
        incrementedName = incrementedName+imageIncrement+'.png'
        var jsonReference = incrementedName.replace("C:/xampp/htdocs/",".") 
        //console.log(jsonReference);
        

        // take a screenshot
        browser.takeScreenshot().then(function (png) {
            writeScreenShot(png, incrementedName);
        });
        /*
        *    For every expectation that passes, push the details into temp. expectations array
        */
        for(var i = 0; i < result.passedExpectations.length;i++){
            //
            //TODO - Create custom matchers for better reporting reports
            //
            expectations.push({
                status    : "Passed.",
                problem   : "None.",
                error     : "None."
            })

        }
        /*
        *    For every expectation that fails, push the details into temp. expectations array
        */
        for(var i = 0; i < result.failedExpectations.length;i++){
            //
            //TODO - Create custom matchers for better reporting reports
            //
            expectations.push({
                status    : "Failed.",
                problem   : result.failedExpectations[i].message,
                error     : result.failedExpectations[i].stack 

            })
        }
        /*
        *    percentage 
        */
        var total  = result.passedExpectations.length + result.failedExpectations.length;
        var passed = result.passedExpectations.length;
        var suitePercentage = getPercentage(total,passed)

        /*
        *    When we have collected all the data, 
        *    push the expectations and test details into suite spec results
        */
            suiteSpecs.push(result.description);
                suiteSpecsResults.push({
                    spec         : result.description,
                    duration     : elapsedTime + "ms",
                    percentage   : suitePercentage,
                    screenshot   : jsonReference,           // lazy references
                    url          : global.currentURL,
                    expectations : expectations
                });
        // get test successfull count
        totalTestPassedCount = totalTestPassedCount + result.passedExpectations.length;
        totalTestFailCount   = totalTestFailCount   + result.failedExpectations.length;
        suiteTestPassedCount = suiteTestPassedCount + result.passedExpectations.length;
        suiteTestFailCount   = suiteTestFailCount   + result.failedExpectations.length;
    },
/*
*
*   When a test suite is done, we push the suite and its results results into our report object
*
*/
    this.suiteDone = function(result){
        var elapsedTime = new Date() - suiteTimer;
        var tempPercentage = getPercentage( suiteTestPassedCount + suiteTestFailCount, suiteTestPassedCount );
        
        reportObject.Test_Results.push({
            suite        : tempSuiteName,
            passed       : suiteTestPassedCount,
            failed       : suiteTestFailCount,
            percentage   : tempPercentage,
            duration     : elapsedTime + "ms",
            specdetails  : suiteSpecsResults
        })           
    },
/*
*
*   When Jasmine is done, we write the Json file
*
*/
    this.jasmineDone = function(){
        // set total elapsed time
        var elapsedTotalTime = new Date() - testTimer;
        reportObject.Test_Duration = elapsedTotalTime +"ms";
        // set total expectations
        reportObject.Total_Expectations = totalTestPassedCount + totalTestFailCount;
        reportObject.Total_Expectations_Passed = totalTestPassedCount;
        reportObject.Total_Expectations_Fail   = totalTestFailCount;
        // set expectations percentage
        var totalpercentage = getPercentage(reportObject.Total_Expectations,reportObject.Total_Expectations_Passed)
        reportObject.Total_Expectations_Percentage = totalpercentage
        // write Json file
        if (generateJson)writeJson(global.reportPath+reportObject.Application_Name+"/"+reportObject.Application_Name,reportObject)
        // write HTML Report
        if (htmlReport)simpleReport.writeReport(reportObject.Application_Name,reportObject);
        // update angular report
        //angularReport.writeAngularControler();
    }
    return this;
}

