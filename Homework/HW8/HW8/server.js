
var http = require("http");
var fs = require("fs");
var pathNodeJS = require("path");

if (process.argv[2] === undefined) {
    console.log("node server.js <pathname>");
    process.exit(1);
}
    
path = process.argv[2];

var g_img;

var handler = function (request, response) {

    console.log("Request URL: " + request.url + "  " + request.method);

    if (request.method === "POST") {
            var body=[];
            
            request.on ("data", function (data) {
                body.push(data);
            });

            request.on ("end", function() {
                g_img = Buffer.concat(body).toString();
            
                response.writeHead(200, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
                response.end();
            });
    }

    else if (request.method === "GET") {
        try {
            var serviceURL = request.url;

            var actualPath = pathNodeJS.join(path, serviceURL);
            actualPath = decodeURI(actualPath);

            // send the requested page
            if (serviceURL == "/getClient.html" || serviceURL == "/postClient.html") {

                var readS = fs.createReadStream(actualPath);

                response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
                readS.on('data', function(chunk) {
                    response.write(chunk);
                });
                readS.on('end', function() { response.end(); });
            }
            else { 
                // send image         
                response.writeHead(200, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
                response.end(g_img);
            }
        }
        catch (e) {
            response.writeHead(500, { "Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
            response.end("<html><h1>500 Internal Server Error</h1></html>");
        }
    }
};

http.createServer(handler).listen(8080);
console.log("Server running on port 8080 at directory : " + path);