var fs 			    = require('fs');
module.exports      = {
 
  writeFile: function (_FILENAME,_OBJECT) {
  /*
  *   Writes object to Json format
  */
  _FILENAME = _FILENAME.replace(" ", "_");
  if(global.debug)console.log("Writing Json file: "+_FILENAME);
	fs.writeFile(_FILENAME+"-jsonReport.json", JSON.stringify(_OBJECT, null, 4), function(err) {
		if(err) {
      if(global.debug)console.log("MAKE SURE YOU HAVE NO PROJECT FILES OPEN")
      if(global.debug)console.log(err)
		}
	}); 
  }
};