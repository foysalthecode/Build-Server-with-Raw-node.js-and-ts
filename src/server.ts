import http, { IncomingMessage, Server, ServerResponse } from "http";
import config from "./config";
import { RouteHandler, routes } from "./helpers/RouteHandler";
import "./routes";

function findDynamicRoutes(method: string, url: string) {
  const methodMap = routes.get(method);
  if (!methodMap) return null;

  for (const [routePath, handler] of methodMap.entries()) {
    const routesParts = routePath.split("/");
    const urlParts = url.split("/");

    if (routesParts.length !== urlParts.length) continue;
    const params: any = {};
    let matched = true;

    for (let i = 0; i < routesParts.length; i++) {
      if (routesParts[i]?.startsWith(":")) {
        params[routesParts[i]?.substring(1)!] = urlParts[i];
      } else if (routesParts[i] !== urlParts[i]) {
        matched = false;
        break;
      }
    }
    if (matched) {
      return { handler, params };
    }
  }
  return null;
}

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    console.log("Server is running....");

    const method = req.method?.toUpperCase() || "";
    const path = req.url || "";
    const methodMap = routes.get(method);
    const handler: RouteHandler | undefined = methodMap?.get(path);

    if (handler) {
      handler(req, res);
    } else if (findDynamicRoutes(method, path)) {
      const match = findDynamicRoutes(method, path);
      (req as any).params = match?.params;
      match?.handler(req, res);
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
  }
);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
