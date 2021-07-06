Make sure to create the dist firsT: npm run compile

## Usage with Deno

Note that this approach in this example uses the 1st method in the "Bundle" section, because from a user perspective, this is a lot simpler

### Bundle

There is 2 ways you can bundle your client side scripts using Deno:

#### 1

Use `deno bundle`:

```shell
$ cd examples/deno
$ deno bundle --config tsconfig.json components/App.ts components/app.js
$ npx serve-http
```

Note that currently, there are multiple issues with this:

https://github.com/denoland/deno/issues/11286
https://github.com/denoland/deno/issues/11287

#### 2

Using `Deno.emit`:

```ts
const { diagnostics, files } = await Deno.emit("./components/App.ts", {
    bundle: "classic",
    compilerOptions: {
        "target": "es2020",
        "module": "esnext",
        "lib": ["dom", "DOM.Iterable", "ESNext"],
        "sourceMap": false
    },
})
const fd = await Deno.formatDiagnostics(diagnostics)
console.log(fd)
const fileKey = Object.keys(files)[0]
const content = files[fileKey]
const encoder = new TextEncoder()
Deno.writeFileSync("./components/app.js", encoder.encode(content))
```

```shell
$ deno run -A --unstable compile.ts
$ npx serve-http
```

Note that currently, there are multiple issues with this:

https://github.com/denoland/deno/issues/11286
https://github.com/denoland/deno/issues/11287

### Transpile

NOTE: This *transpiles*, and DOES NOT *bundle*, AND keeps the RAW LINKS to destiny. For example, everytime a user requests the js files, a new request will be made to the dependencies cdn.

This setup uses:

  - `compile.ts` to transpile your component. This the exact same as using webpack (without bundling) and tsc
  - `components/App.ts` - the component to use on your frontend
  - `index.html` - the view to serve your bundled file

Note that our source code files are slightly different this time, because as we are transpiling, it is going to generate a new file *per* dependency. Here's how you can do it:

```ts
// components/App.ts
import { Component, css, html, register } from "./dist/mod.js"; // or the cdn
class CustomP extends Component<{
    customText: string
}> {
    static override styles = css`
      p {
        color: red;
      }
    `
    template = html`<p>${this.customText}</p>`
}
class AppRoot extends Component {
    override template = html`
        <div>
            <${CustomP} prop:customText=${"hello"}></${CustomP}>
        </div>
    `;
}
register(AppRoot)
```

```shell
$ cd examples/deno
$ cp -r ../../dist . # only needed because npx cannot get files in parent directories
$ deno run -A --unstable transpile.ts
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

## Usage With Browser

This setup uses:

  - `components/App.ts` - the component to use on your frontend
  - `index.html` - the view to serve your bundled file

```shell
$ cd examples/browser
$ cp -r ../../dist .
$ npx serve-http
```