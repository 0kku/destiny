Make sure to create the dist firsT: npm run compile

## Usage with Deno

NOTE: This *transpiles*, and DOES NOT *bundle* AND keeps the RAW LINKS to destiny

Ensure you're on latest deno verion, 1.11.2

This setup uses:

  - `compile.ts` to transpile your component. This the exaxt same as using webpack/tsc
  - `components/App.ts` - the component to use on your frontend
  - `index.html` - the view to serve your bundled file


```shell
$ cd examples/deno
$ cp -r ../../dist .
$ deno run -A --unstable compile.ts
$ npx serve-http
# go to browser
```

NOTE this doesnt work, because compile.ts doesnt write the transpiled files. Because we're using deno.emit, we aren't bundling

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

## Usage With Browser

This setup uses:

  - `components/App.ts` - the component to use on your frontend
  - `index.html` - the view to serve your bundled file

```shell
$ cd examples/browser
$ cp -r ../../dist .
$ npx serve-http
```