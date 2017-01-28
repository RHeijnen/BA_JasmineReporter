var fs 			          = require('fs');
var exec              = require('child_process').exec;

module.exports      = {
 
  createResultFolder: function (_FILENAME) {
    /*
    *   setup folder structure
    */
    
    _FILENAME = _FILENAME.replace(" ", "_");
    if(global.debug)console.log('------File Structure-------');
    if(global.debug)console.log('reportPath:  '+ global.reportPath);
    if(!fs.existsSync(global.reportPath)){
      if(global.debug)console.log("global.reportPath does not exist, creating it")
      fs.mkdirSync(global.reportPath);
    };
    if(!fs.existsSync(global.reportPath+_FILENAME)){ 
      if(global.debug)console.log("global.reportPath  exists, creating project folder: "+_FILENAME)
      fs.mkdirSync(global.reportPath+_FILENAME);
    }else{
      if(global.debug)console.log("project folder exists, deleting it. "+_FILENAME)
      deleteFolderRecursive(global.reportPath+_FILENAME)
      if(!fs.existsSync(global.reportPath+_FILENAME)){ 
        if(global.debug)console.log("recursive deletion done, creating project folder: "+_FILENAME)
        fs.mkdirSync(global.reportPath+_FILENAME);
      };
    };
    if(!fs.existsSync(global.reportPath+_FILENAME+"/_Screenshots/")){ 
      if(global.debug)console.log("   -creating sub folder: _Screenshots")
      fs.mkdirSync(global.reportPath+_FILENAME+"/_Screenshots/");
    };
    if(!fs.existsSync(global.reportPath+_FILENAME+"/_Attachments/")){ 
      if(global.debug)console.log("   -creating sub folder: _Attachments")
      fs.mkdirSync(global.reportPath+_FILENAME+"/_Attachments/");
    };
    if(global.debug)console.log('===== /File Structure=======');


     /* 
    if (!fs.existsSync(dir)){ 
        console.log(dir);       
        fs.mkdirSync(dir);
    }else {
        if(!_FILENAME.length < 3){
            deleteFolderRecursive(dir)
        }else{
            console.log('FILENAME IS TOO SHORT');
        }
    }
    */


  function deleteFolderRecursive(path) {
    if(global.debug)console.log('===== deleting recursive '+path +'=======');
    if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file,index){
        var curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else { 
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);

    }
  };
  }
};