import http, { IncomingMessage, Server, ServerResponse } from "http";
import path from "path";

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    console.log("Server is running....");

    if (req.url === "/" && req.method === "GET") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Hello from node js and typescript",
          path: req.url,
        })
      );
    }
  }
);

server.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
});
