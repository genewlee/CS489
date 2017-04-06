var http = require("http");
var fs = require("fs");
var pathNodeJS = require("path");

var port = 8080;
var path = "/Users/gene/Desktop/HW7";

var handler = function (request, response) 
{
	// url needs to start with '/lists' or '/files'
	if (request.url.length < 6) {
		response.writeHead(400, {"Content-Type": "text/html"});
		response.end("<html><h1>400 Bad Request</h1></html>");
		return;
	}
	
	// parse and process url
	var url = request.url.toLowerCase();
	var service = url.substr(0,6);
	url = (url.length == 6) ? "/" : url.substr(6); // reset so that 'lists' or 'files' is deleted if exists

	if (service == "/lists" && url[0] == "/")
	{
		response.writeHead(200, {"Content-Type": "application/json"});

		// actual path
		var actualPath = pathNodeJS.join(path, url);
		actualPath = decodeURI(actualPath);

		var json = "{ \"file_list\": [";

		// Sychronously get the list of files
		var items = fs.readdirSync(actualPath);

		// Apped items to json
		for (var i = 0; i < items.length; i++) {
			var file = pathNodeJS.join(actualPath, items[i]);
			var stats = fs.statSync(file);
			var fileOrDir;
			if (stats.isDirectory()) {
				fileOrDir = "directory";
			}
			else if (stats.isFile()) {
				fileOrDir = "file";
			}
			else {
				continue;
			}
			json += ("{ \"name\": \"" + file.split(/[/,\\ ]+/).pop() + "\"");
			json += (", \"type\": \"" + fileOrDir + "\""); // append the type (i.e. file or dir)

			// append the stats of the item
			for (var propName in stats) {
				var propVal = stats[propName];
				if (propVal !== undefined && propVal !== null && !(propVal instanceof Function)) {
					json += (", \"" + propName + "\": \"" + propVal + "\"");
				}
			}
			json += "},";
		}

		json = json.slice(0, -1); // take off last comma
		json += "]}";
		response.end(json);
	}
	else
	{
		response.writeHead(400, {"Content-Type": "text/html"});
		response.end("<html><h1>400 Bad Request</h1></html>");
	}
}

http.createServer(handler).listen(port);
console.log("Server running on port: " + port);