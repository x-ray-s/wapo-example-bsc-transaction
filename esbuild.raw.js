// copy from https://github.com/hannoeru/esbuild-plugin-raw/blob/main/src/index.ts

const { readFile } = require('fs/promises');
const path = require('path');

function rawPlugin() {
  return {
    name: 'raw',
    setup(build) {
      build.onResolve({ filter: /\?raw$/ }, (args) => {
        return {
          path: args.path,
          pluginData: {
            isAbsolute: path.isAbsolute(args.path),
            resolveDir: args.resolveDir,
          },
          namespace: 'raw-loader',
        };
      });
      build.onLoad(
        { filter: /\?raw$/, namespace: 'raw-loader' },
        async (args) => {
          const fullPath = args.pluginData.isAbsolute
            ? args.path
            : path.join(args.pluginData.resolveDir, args.path);
          return {
            contents: await readFile(fullPath.replace(/\?raw$/, '')),
            loader: 'text',
          };
        }
      );
    },
  };
}

module.exports = rawPlugin;
