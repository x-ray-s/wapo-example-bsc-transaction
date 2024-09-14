const { serve } = require("@hono/node-server");
const { handle } = require("@phala/wapo-env/guest");
const { Hono } = require("hono");
const { info, checkWhitelist, getWhitelist } = require("./index");
const app = new Hono();

let html = "";
if (process.env.NODE_ENV === "production") {
  html = require("../dist/index.html?raw");
} else {
  html = `<h1>Please use vite to run client</h1>`;
}

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

if (process.env.RUNTIME === "wapo") {
  handle(app);
} else {
  // you can change dev server config below
  serve(app);
  console.log("Server is running on http://localhost:3000");
}
