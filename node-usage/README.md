## Usage with Deno

Ensure you're on latest deno verion, 1.11.2

This setup uses:

  - `compile.ts` to transpile your component. This the exaxt same as using webpack/tsc
  - `components/App.ts` - the component to use on your frontend
  - `index.html` - the view to serve your bundled file

```shell
# add .d.ts to globalthis import in dist/mod.d.ts
$ deno run -A --unstable compile.ts
$ npx serve-http
# go to browser
```

## Usage with Node

This will work AS IS

This setup uses:

  - `tsconfig.json` used in conjunction with webpack
  - `webpack.config.js` - uses to tranpsile your component
  - `components/App.ts` - the component to use on your frontend
  - `index.html` - the view to serve your bundled file

```shell
$ node_modules/.bin/webpack --config webpack.config.js
$ npx serve-http
# go to browser
```