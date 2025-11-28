import { readUsers, writeUsers } from "../helpers/fileDb";
import parseBody from "../helpers/parseBody";
import addRoutes from "../helpers/RouteHandler";
import sendJson from "../helpers/sendJson";

addRoutes("GET", "/", (req, res) => {
  sendJson(res, 200, { message: "Hello from node js and ts", path: req.url });
});

//get route
addRoutes("GET", "/api", (req, res) => {
  sendJson(res, 200, {
    message: "Health status ok...",
    path: req.url,
  });
});

//post route
addRoutes("POST", "/api/users", async (req, res) => {
  const body = await parseBody(req);

  const users = readUsers();
  const newUser = {
    ...body,
  };

  users.push(newUser);
  writeUsers(users);

  sendJson(res, 201, { success: true, data: body });
});

//put route

addRoutes("PUT", "/api/users/:id", async (req, res) => {
  const { id } = (req as any).params;
  const body = await parseBody(req);

  const users = readUsers();

  const index = users.findIndex((user: any) => user.id == id);

  if (index === -1) {
    sendJson(res, 404, {
      success: false,
      message: "User not found",
    });
  }

  users[index] = {
    ...users[index],
    ...body,
  };

  writeUsers(users);

  sendJson(res, 202, {
    success: true,
    message: `id ${id} user updated`,
    data: users[index],
  });
});
