var fs 			    = require('fs');
module.exports      = {
  writeReport: function (_FILENAME,_OBJECT) {
    var reportObject = _OBJECT;
    _FILENAME = _FILENAME.replace(" ", "_");
    content = `

    <style>
        tr:nth-child(even){background-color: #f2f2f2}
        tr:nth-child(odd){background-color: #003d57;color:white}
        body{font-family:"open_sans",sans-serif}.suite{width:100%;overflow:auto}
        table {border-collapse: collapse;width: 100%;}
        th, td {text-align: left;padding: 8px;}
        .entry{background-color:#f2f2f2;color:#003d57;}
        .entryHeader{background-color:#003d57;color:#f2f2f2;}
        .suite .stats{margin:0;width:90%;padding:0}
        .suite .stats li{display:inline;list-style-type:none;padding-right:20px}
        .suite h2{margin:0}.suite header{margin:0;padding:5px 0 5px 5px;background:#003d57;color:white}
        .spec{width:100%;overflow:auto;border-bottom:1px solid #e5e5e5}
        .spec:hover{background:#e8f3fb}
        .spec h3{margin:5px 0}
        .spec .description{margin:1% 2%;width:65%;float:left}
        .spec .resume{width:29%;margin:1%;float:left;text-align:center}
        .itemPassed {display: block; padding: 1px 1px; color:green} 
        .itemFailed {display: block; padding: 1px 1px; color:red} 
        .spec:hover{background:#e8f3fb}
    </style>

        <table border='1' >
		<tr>
			<td>Name</td>
			<td>` + reportObject.Application_Name+ `</td>
			<td>Version</td>
			<td>` + reportObject.Application_Version+ `</td>
		</tr>

        <tr>
			<td>Url</td>
			<td>` + reportObject.Application_URL+ `</td>
			<td>Build</td>
			<td>` + reportObject.Application_Build+ `</td>
		</tr>

		<tr>
			<td>Date</td>
			<td>` + reportObject.Test_Date+ `</td>
			<td>Duration</td>
			<td>` + reportObject.Test_Duration+ `</td>
		</tr>
		<tr>
			<td>Percentage Passed</td>
			<td>` + reportObject.Total_Expectations_Percentage+`%</td>
			<td>Total specs</td>
			<td>` + reportObject.Total_Specs+ `</td>
		</tr>
		<tr>
			<td>Total Expectations</td>
			<td>` + reportObject.Total_Expectations+ `</td>
			<td>Total Failed</td>
			<td>` + reportObject.Total_Expectations_Fail+ `</td>
		</tr>		
			  	 </table><br> 

`;
    for(var outer = 0; outer < reportObject.Test_Results.length;outer++){
        content = content + //<div class="entry"> <div class="entryHeader">
        `   
            <article class="suite"><header><h2>`+ reportObject.Test_Results[outer].suite +` - `+ reportObject.Test_Results[outer].duration +`</h2>
            <ul class="stats"><li>Tests: <strong>`+ (reportObject.Test_Results[outer].passed + reportObject.Test_Results[outer].failed) +`</strong>
                       </li><li>Passed: <strong>`+reportObject.Test_Results[outer].passed +`</strong>
                       </li><li>Failures: <strong>`+reportObject.Test_Results[outer].failed +`</strong></li></ul></header>
            </article>
        

        `
        
        for(var middle = 0; middle < reportObject.Test_Results[outer].specdetails.length; middle ++){

        content = content + //<div class="entry"> <div class="entryHeader">
        `   
            <div class="spec">
                <div class="description">
                    <h3>`+ reportObject.Test_Results[outer].specdetails[middle].spec +` - `+reportObject.Test_Results[outer].specdetails[middle].duration +`</h3>




<ul>
        `

            for (var inner = 0; inner < reportObject.Test_Results[outer].specdetails[middle].expectations.length;inner++){
                if(reportObject.Test_Results[outer].specdetails[middle].expectations[inner].status =="Passed."){
                    content = content + `
                    <li class = "itemPassed">`+reportObject.Test_Results[outer].specdetails[middle].expectations[inner].status+`</li>`
                }else {
                    content = content + `
                    <li class = "itemFailed">`+reportObject.Test_Results[outer].specdetails[middle].expectations[inner].problem+`</li>
                    <li class = "itemInformation">`+reportObject.Test_Results[outer].specdetails[middle].expectations[inner].error+`</li>`
                    
                }

            }
            content = content +`</ul></div>        <div class="resume">
            
		<a href="`+reportObject.Test_Results[outer].specdetails[middle].screenshot+`">
		<img src="`+reportObject.Test_Results[outer].specdetails[middle].screenshot+`" width="100" height="100" />
		</a><br /><span>Tests passed: `+reportObject.Test_Results[outer].specdetails[middle].percentage+`%</span><br /><progress max="100" value="`+reportObject.Test_Results[outer].specdetails[middle].percentage+`"></progress></div>
	    </div>` 

        content = content +               
        `
            </div>	

        `
        }



    }
	fs.writeFile(global.reportPath+_FILENAME+"/"+_FILENAME+"-htmlReport.html", content, function (err) {			// write file 
		if (err) return console.log(err);
	});
  }
};