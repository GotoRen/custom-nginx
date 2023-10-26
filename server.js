const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 8080;

function getNginxVersion(callback) {
  fs.readFile("/etc/nginx/nginx_version", "utf8", (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
}

app.get("/", (req, res) => {
  getNginxVersion((error, version) => {
    const remoteAddr = req.socket.remoteAddress;
    const splittedRemoteAddr = remoteAddr.split(":");
    const sourceIp = splittedRemoteAddr[splittedRemoteAddr.length - 1];

    const localAddr = req.socket.localAddress;
    const splittedLocalAddr = localAddr.split(":");
    const destinationIp = splittedLocalAddr[splittedLocalAddr.length - 1];

    const hostName = require("os").hostname();
    const httpMethod = req.method;
    const originalUrl = req.originalUrl;
    const allHeaders = req.headers;
    const httpVersion = req.httpVersion;
    const requestUrl = `${req.protocol}://${req.headers.host}${req.originalUrl}`;

    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.write("Maintained by RenGoto@Pluslab\n");

    // Client info.
    res.write("\nCLIENT VALUES:\n");
    res.write(`source_ip=${sourceIp}\n`);
    res.write(`destination_ip=${destinationIp}\n`);
    res.write(`http_method=${httpMethod}\n`);
    res.write(`real_path=${originalUrl}\n`);
    res.write(`http_version=${httpVersion}\n`);
    res.write(`request_uri=${requestUrl}\n`);

    // Server info.
    res.write("\nSERVER VALUES:\n");
    res.write(`host_name=${hostName}\n`);
    if (error) {
      res.write(`server_version=${error}\n`);
    } else {
      res.write(`server_version=${version}`);
    }

    // Header info.
    res.write("\nHEADERS RECEIVED:\n");
    res.write(`accept=${allHeaders.accept}\n`);
    res.write(`host=${allHeaders.host}\n`);
    res.write(`user-agent=${allHeaders["user-agent"]}\n`);

    res.end();
  });
});

app.listen(port, () => {
  console.log(`Listen port ${port}...`);
});
