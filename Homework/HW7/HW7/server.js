// Gene Lee
// 11216720
// Homework 7

// Server
// Option 1:
// 		URL starts with a string that distinguishes the request as either wanting file listings/information vs. file content. 
//		For example, all list-oriented URLs start with “/lists” and all file-download URLs start with “/files”

var http = require("http");
var fs = require("fs");
var pathNodeJS = require("path");

var port = 8080;
var path = "/";//"/Users/gene/Desktop/HW7";

var handler = function (request, response) 
{
	// url needs to start with '/lists' or '/files'
	if (request.url.length < 6) {
		response.writeHead(400, { "Content-Type": "text/html" });
		response.end("<html><h1>400 Bad Request</h1></html>");
		return;
	}
	
	// parse and process url
	var url = request.url.toLowerCase();
	var service = url.substr(0,6);
	url = (url.length == 6) ? "/" : url.substr(6); // reset so that 'lists' or 'files' is deleted if exists

	// actual path
	var actualPath = pathNodeJS.join(path, url);
	actualPath = decodeURI(actualPath);

	if (service == "/lists" && url[0] == "/") // check if url[0] is "/" because it could be that the url is listss (ie. extra 's')
	{
		response.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });

		var json = "{ \"file_list\": [";

		// Sychronously get the list of files
		var items = fs.readdirSync(actualPath);

		// Apped items to json
		for (var i = 0; i < items.length; i++) 
		{
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
			var fileName = file.split(/[/,\\]+/).pop(); // split for the last to get filename, handle slash for unix-based and windows
			json += ("{ \"name\": \"" + fileName + "\"");
			json += (", \"type\": \"" + fileOrDir + "\","); // append the type (i.e. file or dir)

			var statsJson = JSON.stringify(stats)
			json += (statsJson.substr(1, statsJson.length - 1) + ","); // remove the beginning '{' and end '}' of the stringify
		}

		json = json.slice(0, -1); // take off last comma
		json += "]}";
		response.end(json);
	}
	else if  (service == "/files" && url[0] == "/") 
	{
		var lastDotIndex = actualPath.lastIndexOf(".");
		var ext = "";
		if (lastDotIndex > 0) {
			ext = actualPath.substr(lastDotIndex).toLowerCase();
		}

		var contentType;
		if (ext == ".html" || ext == ".htm") { contentType = "text/html"; }
		else if (ext == ".txt") { contentType = "text/plain"; }
		else if (ext == ".xml") { contentType = "text/xml"; }
		else if (ext == ".pdf") { contentType = "application/pdf"; }
		else if (ext == ".gif") { contentType = "image/gif"; }
		else if (ext == ".jpg" || ext == ".jpeg") { contentType = "image/jpeg"; }
		else if (ext == ".json") { contentType = "application/json"; }
		else { contentType = "application/octet-stream"; }

		var allAtOnce = false;
		if (allAtOnce) {
			// read entire file
			var buf = fs.readFileSync(actualPath);

			// write back file data
			response.writeHead(200, { "Content-Type": contentType, "Access-Control-Allow-Origin": "*" });
			response.end(buf);
		}
		else {
			// Open read stream
			var readStream = fs.createReadStream(actualPath);

			// write back file data
			response.writeHead(200, { "Content-Type": contentType, "Access-Control-Allow-Origin": "*" });
			readStream.on('data', function(chunk) {
				response.write(chunk);
			});
			readStream.on('end', function() { response.end(); });
			return;
		}
	}
	else
	{
		response.writeHead(400, {"Content-Type": "text/html"});
		response.end("<html><h1>400 Bad Request</h1></html>");
	}
}

http.createServer(handler).listen(port);
console.log("Server running at http://127.0.01:" + port + "/");