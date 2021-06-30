const { diagnostics, files } = await Deno.emit("./components/App.ts", {
    compilerOptions: {
        "target": "es2020",
        "module": "esnext",
        "lib": ["dom", "DOM.Iterable", "ESNext"],
        types: ["../src/mod.d.ts"]
    }
})
const fd = await Deno.formatDiagnostics(diagnostics)
console.log(fd)
// console.log(files)