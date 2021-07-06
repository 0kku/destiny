/**
 * This approach would be different given our component imports from a url.
 * The user would use crumpets to transpile the files
 */

const { diagnostics, files } = await Deno.emit("./components/App.ts", {
    compilerOptions: {
        "target": "es2020",
        "module": "esnext",
        "lib": ["dom", "DOM.Iterable", "ESNext"],
        "sourceMap": false
    },
})
const fd = await Deno.formatDiagnostics(diagnostics)
console.log(fd)
const key = Object.keys(files).find(f => f.includes("App.ts")) as string
files[key] = files[key].replace("deps.ts", "deps.js")
const key2 = Object.keys(files).find(f => f.includes("deps.ts")) as string
files[key2] = files[key2].replace("src/mod.ts", "dist/mod.js")
Deno.writeFileSync("./components/app.js", new TextEncoder().encode(files[key]))
Deno.writeFileSync("./components/deps.js", new TextEncoder().encode(files[key2]))