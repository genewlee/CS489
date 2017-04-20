// Cpt S 489 Node.js utility app
// Offered for HW8 because certain browsers may not run workers locally
// Therefore, host your page and scripts on a Node.js server when testing

var http = require("http");
var fs = require("fs");
var pathNodeJS = require("path");

// First make sure we have a runtime argument for the directory
if (process.argv.length <= 2)
{
    console.log("Usage: " + __filename + " content_path");
    console.log("Example: " + __filename + " /Users/Bob/SharedFiles");
    process.exit(-1);
}

var path = process.argv[2];

var handler = function(request, response)
{
	// Get actual path
	var url = request.url;
	var actualPath = pathNodeJS.join(path, url);
	actualPath = decodeURI(actualPath);

	// Get the file extension
	var lastDotIndex = actualPath.lastIndexOf(".");
	var ext = "";
	if (lastDotIndex >= 0)
	{
		ext = actualPath.substr(lastDotIndex).toLowerCase();
	}
	// Determine content type from extension
	var contentType;
	if (ext == ".html" || ext == ".htm") { contentType = "text/html"; }
	else if (ext == ".txt") { contentType = "text/plain"; }
	else if (ext == ".xml") { contentType = "text/xml"; }
	else if (ext == ".pdf") { contentType = "application/pdf"; }
	else if (ext == ".gif") { contentType = "image/gif"; }
	else if (ext == ".png") { contentType = "image/png"; }
	else if (ext == ".jpg" || ext == ".jpeg") { contentType = "image/jpeg"; }
	else if (ext == ".json") { contentType = "application/json"; }
	else { contentType = "application/octet-stream"; }

	try
	{
		fs.statSync(actualPath);

		// Open the read stream for the file
		var readS = fs.createReadStream(actualPath);

		// Write back file data
		response.writeHead(200, { "Content-Type": contentType });
		readS.on('data', function(chunk) {
			response.write(chunk);
		});
		readS.on('end', function() { response.end(); });
	}
	catch (ex)
	{
		console.log("Exception when trying to read file '" + actualPath + "' => returning 404");
		response.writeHead(404, { "Content-Type": "text/html" });
		response.end("<html><h1>404 Not Found</h1></html>");
	}
};
http.createServer(handler).listen(8080);
console.log("Server running on port 8080");