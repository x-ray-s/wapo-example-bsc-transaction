const { Hono } = require("hono");
const { info, checkWhitelist, getWhitelist } = require("./index");
const app = new Hono();

let html = "";
if (process.env.NODE_ENV === "production") {
  html = require("../dist/index.html?raw");
} else {
  html = `<h1>Please use vite to run client</h1>`;
}

app.onError((err, c) => {
  console.error(err);
  return c.text(err.message, 500);
});

app.get("/", async (c) => {
  if (c.req.query("info")) {
    return c.json(await info());
  }
  if (c.req.query("whitelist")) {
    return c.json(getWhitelist());
  }
  return c.html(html);
});

app.post("/", async (c) => {
  const { address } = await c.req.json();
  const valid = await checkWhitelist(address);
  return c.json({ valid });
});

let launcher = null;

if (process.env.RUNTIME === "wapo") {
  const { handle } = require("@phala/wapo-env/guest");

  launcher = handle(app);
} else {
  const { serve } = require("@hono/node-server");

  // you can change dev server config below
  launcher = serve(app);
  console.log("Server is running on http://localhost:3000");
}

globalThis.launcher = launcher;
