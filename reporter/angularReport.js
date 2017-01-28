var readline 		= require('readline');
var q               = require('../node_modules/promised-io/promise');
var fs              = require("../node_modules/promised-io/fs");

var fileArray            = [];
var jsonString           = ".json";
var fileName             = "app.js"


module.exports      = {
 
  writeAngularControler: function () {
  /*
  *   Writes angular controller
  */
  var testFileLocation      = global.reportPath +"_TestResults/";
  var targetLocation        = global.reportPath;
  
  var content = `'use strict';


            /*
            *   WARNING GETS OVERWRITTEN IN createAngularControler.js > Copy it in there
            */

var app = angular.module('testApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

app.controller('MainCtrl', function($scope, $http, $interval,$mdSidenav) {

  $scope.originatorEv = null;
  $scope.restAlive = false;
  $scope.protractorAlive = false;
  $scope.tab = 0;
  $scope.innerTab = 0;
  $scope.data = [];
  $scope.imagePath = 'img/washedout.png';
  $scope.optionsDisplayed = false;
  $scope.data.cb1 = true;
  readJson();
  $scope.reportCollection = [];
  
    function deleteEntry() {
		
	}
   
	$scope.performMenuAction = function(item) {
		console.log("eyoo")
   };

	
  $interval(checkServicesOnline,2500);
  //$interval(readJson, 2500);
    /*
    *
    *   
    */
    $scope.setTab = function(newValue){
        $scope.setInnerTab(0);
        $scope.tab = newValue;
		disableMenu()
    };
	
    function disableMenu(){
        $scope.setOptionsVisiblity(false);

    };

    $scope.setInnerTab = function(newValue) {
		disableMenu()
        $scope.innerTab = newValue;
    }
	
    $scope.setOptionsVisiblity = function(newValue) {
        $scope.optionsDisplayed = newValue;
    }
    $scope.openLeftMenu = function() {
        $mdSidenav('left').toggle();
    };

    function checkServicesOnline(){
		console.log("checking")
                try{
                    $http.get('http://localhost:3000/protractorPulse').success(function(data){
                        if(data == "open"){
                            $scope.protractorAlive = true;
                        }else{
                            $scope.protractorAlive = false;
                        }
                    });
                }catch(error){
                    console.log(error);
                    
                }


/*
            $http({
                method: 'GET',
                url: '/http://localhost:3000/protractorPulse'
            }).then(function successCallback(response) {
                console.log(response.status);
                // keeps returning 200, even if service is down/up

            }, function errorCallback(response) {
                console.log('Should not happen, unless the restservice is offline');
                
            });
*/
                try{
                    $http.get('http://localhost:3000/restPulse').success(function(data){
                        if(data == "open"){ 
                            $scope.restAlive = true;
                        }else{
                            $scope.restAlive = false;
                        }
                    });
                }catch(error){
                    console.log(error);
                    
                }


    }; 

    $scope.startProtractor = function(){ 
        if($scope.protractorAlive){
            $http.get('http://localhost:4444/selenium-server/driver/?cmd=shutDownSeleniumServer').success(function(data){
                
            });
        }else{
            $http.get('http://localhost:3000/startProtractor').success(function(data){
                
            });
        }
    };

    $scope.startGenericTest = function(){ 
        console.log('Generic test started');
        if($scope.protractorAlive){
            $http.get('http://localhost:3000/startgenerictest').success(function(data){
            });
        }else{
            console.log('Protractor not reachable');

        }
    }; 
  



    function readJson() {
        $scope.data = [];
   
`;
    var contentFinish = `	 

    }

});
` 

    function loadFileData(){
        fs.readdir(testFileLocation).then(function(files){                // resolver returns array (waits till all files are loaded)
            for(var i = 0; i < files.length;i++){                       // for every file returned
                if(files[i].indexOf(jsonString) !=-1){					// check if it ends in .json - add it to the list of file names we are going to parse
                    fileArray.push(files[i])                            // save the filtered file name into a new array
                    //console.log(files[i]);
                }
            }

            for(var i = 0;i<fileArray.length;i++ ){
                content = content +`   
                 
                $http.get("./_TestResults/`+fileArray[i]+`").success(function (data) {
                    $scope.data.push(data);
                });

        `
            }
            content = content +contentFinish;
            writeController();
            writeJsonCollection(fileArray);
        }, function(error) {
            console.log('Error parsing files | '+ error);
        });

    }

    function writeController(){
        fs.writeFile(targetLocation+fileName, content, function(err) {
            if(err) {
                console.log(err);
            }
        }); 
    }
    function writeJsonCollection(fileArray){
        
        fs.writeFile(targetLocation+"files.json",JSON.stringify(fileArray, null, 4) , function(err) {
            if(err) {
                console.log(err);
            }
        }); 
    }
loadFileData();
  

    
  }
};