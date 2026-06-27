import pici from "../pici.js";

function route_index(req) {
  return server.render(`
    <h1>hello</h1>
    <a href="/admin">admin</a>
    `);
}

function is_valid_user(user) {
  return (user.username ?? "") === "admin" && (user.password ?? "") === "admin";
}

function require_admin(req) {
  if (req.session) return;

  if (req.auth && is_valid_user(req.auth)) {
    server.add_session(req);
    return;
  }

  return pici.prompt_login();
}

function route_admin(req) {
  return server.render(`
    <h1>yay ure admin</h1>
    `);
}

const server = pici.create({
  get: {
    "/": route_index,
    "/admin": { check: [require_admin], route: route_admin },
  },
  render: (string) => string, // replace with whatever render function you want
});

server.start();
