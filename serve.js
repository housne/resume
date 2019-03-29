const http = require("http");
const fs = require("fs");
const path = require("path");
const render = require("./render");

// create a simple http server for debug
const server = http.createServer(function(request, response) {
  response.writeHead(200, { "Content-Type": "text/html" });
  render().then(html => {
    response.write(html);
    response.end();
  });
});

server.listen(6001);

console.log("Server is listening");
