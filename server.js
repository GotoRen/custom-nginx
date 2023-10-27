const express = require("express");
const fs = require("fs");

const app = express();
const port = 80;

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
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.write("Maintained by RenGoto@Pluslab\n");

    // Client info.
    const remoteAddr = req.socket.remoteAddress;
    const splittedRemoteAddr = remoteAddr.split(":");
    const clientAddress = splittedRemoteAddr[splittedRemoteAddr.length - 1];

    const httpMethod = req.method;

    const realPath = req.originalUrl;

    const httpVersion = req.httpVersion;

    const requestUrl = `${req.protocol}://${req.headers.host}${req.originalUrl}`;

    res.write("\nCLIENT VALUES:\n");
    res.write(`client_address=${clientAddress}\n`);
    res.write(`http_method=${httpMethod}\n`);
    res.write(`real_path=${realPath}\n`);
    res.write(`http_version=${httpVersion}\n`);
    res.write(`request_uri=${requestUrl}\n`);

    // Server info.
    const hostName = require("os").hostname();

    res.write("\nSERVER VALUES:\n");
    res.write(`host_name=${hostName}\n`);
    if (error) {
      res.write(`server_version=${error}\n`);
    } else {
      res.write(`server_version=${version}\n`);
    }

    // Header info.
    const headers = req.headers;

    res.write("\nHEADERS RECEIVED:\n");
    res.write(`accept=${headers.accept}\n`);
    res.write(`host=${headers.host}\n`);
    res.write(`user-agent=${headers["user-agent"]}\n`);

    res.end();
  });
});

app.listen(port, () => {
  console.log(`Port ${port}: Server listen...`);
});
