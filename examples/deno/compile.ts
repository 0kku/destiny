/**
 * This approach would be different given our component imports from a url.
 * The user would use crumpets to transpile the files
 */

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