// run this file on Node.js
// Terminal:
//		node 3_9.js

// var http = require("http"); // importing a module with the functionality you need for your node.js script
// var handler = function(request, response) {
// 	response.writeHead(200, {"Content-Type": 'text/html'});
// 	response.end("<html><body><h2>Hello World!</h2></body></html>");
// };
// http.createServer(handler).listen(8080);
// console.log('Server running at http://127.0.01:8080/')

function Blah () {};


var http = require("http");
var handler = function(request, response) {
	response.writeHead(200, {"Content-Type": 'text/html'});

	response.write("<html><body>Node.js request object properties:");
	response.write("<table border=2>");

	// Write the enumerable properties of the request object
	var arr = []; // new Array();
	for (var name in request)
	{
		var propValStr = "";
		if (request[name] !== undefined && request[name] !== null)
		{
			if (request[name].toString !== undefined) {
				propValStr = request[name].toString();
			}
		}
		//response.write("<tr><td>" + name + "</td><td>" + propValStr + "</td></tr>");
		arr.push("<tr><td>" + name + "</td><td>" + propValStr + "</td></tr>");
	}
	arr.sort();
	for (var item of arr)
	{
		response.write(item);
	}

	response.end("</table></body></html>");
};
http.createServer(handler).listen(8080);
console.log('Server running at http://127.0.01:8080/')
