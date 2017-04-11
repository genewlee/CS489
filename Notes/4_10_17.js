// SERVER SIDE STORAGE

var fs = require("fs");
var http = require("http");

// var handler = function(request, response)
// {
// 	response.writeHead(200, {"Content-Type": "text/html"});

// 	response.write("<html><body>");

// 	// Log the request url
// 	console.log("Requested URL: " + request.url)

// 	// Try to read the content from "hitcount.dat"
// 	var hitcount = 0;
// 	try {
// 		hitcount = fs.readFileSync("hitcount.dat");
// 	}
// 	catch (ex) {}

// 	// Inc the counter and write new value to file
// 	hitcount++;
// 	fs.writeFileSync("hitcount.dat", hitcount.toString());

// 	// Show the hit count on page
// 	response.write("hitcount: " + hitcount);

// 	response.end("</body></html>");
// }

/* ================================================================================================== */

// var hitCounts = new Object();
// var handler = function(request, response)
// {
// 	response.writeHead(200, {"Content-Type": "text/html"});

// 	// if (request.url != "/") {
// 	// 	response.end("Not counting on non-root url");
// 	// 	return;
// 	// }

// 	response.write("<html><body>");

// 	// Log the request url
// 	console.log("Requested URL: " + request.url)

// 	var hitCount = 1;
// 	// two other options
// 	// hitCount = hitCounts[request.url] || 0;
// 	// if (hitCounts[request.url]) {
// 	// 	hitCount = hitCounts[request.url];
// 	// }
// 	if (request.url in hitCounts) {
// 		hitCount = hitCounts[request.url] + 1;
// 	}
// 	hitCounts[request.url] = hitCount;

// 	// Try to read the content from "hitcount.dat"
// 	/*
// 	var hitcount = 0;
// 	try {
// 		hitcount = fs.readFileSync("hitcount.dat");
// 	}
// 	catch (ex) {}

// 	// Inc the counter and write new value to file
// 	hitcount++;
// 	fs.writeFileSync("hitcount.dat", hitcount.toString());
// 	*/

// 	// Show the hit count on page
// 	response.write("hitcount: \"" + request.url + "\": " + hitCount);

// 	response.end("</body></html>");
// }

/* ================================================================================================== */

var data = "(default)";

var handler = function(request, response) // request is implementing a readstream
{
	response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});

	response.write("<html><body>");

	if (request.method == "GET") { // nodejs doesnt get the body on a get
		response.write("<html><body>");
		response.write(data);
		response.end("</body></html>");
	}
	else if (request.method == "POST") {
		request.on("data", function(chunk) {
			console.log("Data: " + chunk);
		});
	}

}
// var req = new XMLHttpRequest();
// req.open("POST", "http://localhost:8080");
// req.send("Hello from client");


http.createServer(handler).listen(8080);
console.log("Server running at http://127.0.0.1:8080/")
