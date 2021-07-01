// transpile.ts
import { fromFileUrlWin, fromFileUrlUnix, Crumpets } from "./deps.ts";

const crumpet = new Crumpets({
  rootFile: "./src/mod.ts",
  compilerOptions: {
    declaration: true,
      sourceMap: true,
      target: "es2020",
      module: "esnext",
      lib: [
        "dom",
        "DOM.Iterable",
        "esnext",
      ],
      removeComments: true,
      downlevelIteration: true,
      useDefineForClassFields: true,
      strict: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      importsNotUsedAsValues: "error",
      paths: {
        "/dist/*": ["src/*"],
      },
      baseUrl: "./",
  },
});
// Overrite `write` function so instead of placing the transpiled file besides the source, we can move it into dist
// TODO :: if the dist dir doesnt exist, this will throw an error, first we need to check if the filepath exists, if not then create it
Crumpets.write = (filename: string, content: string) => {
  const distPath = filename.replace("/src/", "/dist/")
  const validWritablePath = Deno.build.os === "windows"
  ? fromFileUrlWin(distPath)
  : fromFileUrlUnix(distPath);
  Deno.writeFileSync(validWritablePath, new TextEncoder().encode(content))
}
await crumpet.run();