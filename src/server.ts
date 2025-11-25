import http, { IncomingMessage, Server, ServerResponse } from "http";
import path from "path";
import config from "./config";
import { RouteHandler, routes } from "./helpers/RouteHandler";
import "./routes";

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    console.log("Server is running....");

    const method = req.method?.toUpperCase() || "";
    const path = req.url || "";
    const methodMap = routes.get(method);
    const handler: RouteHandler | undefined = methodMap?.get(path);

    if (handler) {
      handler(req, res);
    } else {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "Route Not Found !!!!",
          path,
        })
      );
    }

    //post api
    // if (req.url === "/api/users" && req.method === "POST") {
    //   // const user = {
    //   //   id: 1,
    //   //   name: "alice",
    //   // };
    //   // res.writeHead(200, { "content-type": "application/json" });
    //   // res.end(JSON.stringify(user));

    //   let body = "";
    //   req.on("data", (chunk) => {
    //     body += chunk.toString();
    //   });
    //   req.on("end", () => {
    //     try {
    //       const parseBody = JSON.parse(body);
    //       console.log(parseBody);
    //       console.log("console current changes");
    //       res.end(JSON.stringify(parseBody));
    //     } catch (err: any) {
    //       console.log(err?.message);
    //     }
    //   });
    // }
  }
);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
