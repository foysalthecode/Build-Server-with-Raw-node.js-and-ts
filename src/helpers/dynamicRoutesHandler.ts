import { routes } from "./RouteHandler";

export default function findDynamicRoutes(method: string, url: string) {
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
