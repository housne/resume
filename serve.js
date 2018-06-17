const http = require("http");
const fs = require("fs");
const path = require("path");

// create a simple http server for debug
const server = http.createServer(function(request, response) {
  response.writeHead(200, { "Content-Type": "text/html" });
  try {
    const html = fs.readFileSync(
      path.join(__dirname, "dist/index.html"),
      "utf8"
    );
    response.write(html);
  } catch (e) {
    response.write(e.message);
  }
  response.end();
});

server.listen(6001);

console.log("Server is listening");
