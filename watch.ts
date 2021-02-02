const watcher = Deno.watchFs("./src")
console.log('Watching')
for await (const event of watcher) {
  if (event.kind === "modify") {
    let path = event.paths[0]
    const fileContent = Deno.readFileSync(path)
    path = path.replace("src", "dist")
    Deno.writeFileSync(path, fileContent)
  }
}
