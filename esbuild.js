const esbuild = require("esbuild");
const rawPlugin = require("./esbuild.raw");
let runtime = '"wapo"';
if (process.env.RUNTIME) {
  runtime = JSON.stringify(process.env.RUNTIME);
}
esbuild
  .build({
    entryPoints: ["server/app.js"],
    bundle: true,
    platform: "node",
    target: ["node16"],
    outfile: "dist/index.js",
    define: {
      "process.env.NODE_ENV": '"production"',
      "process.env.RUNTIME": runtime,
    },
    plugins: [rawPlugin()],
    banner: {
      js: "var module = module || { exports: {} };",
    },
    footer: {
      js: "module.exports = globalThis.launcher;",
    },
  })
  .then(() => console.log("⚡Bundle build complete ⚡"))
  .catch(() => {
    process.exit(1);
  });
