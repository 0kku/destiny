// transpile.ts
import { Crumpets, fromFileUrlUnix, fromFileUrlWin } from "./deps.ts";

const fromFileUrl = Deno.build.os === "windows"
  ? fromFileUrlWin
  : fromFileUrlUnix;
const encoder = new TextEncoder();
const compilerOptions: {
  [key: string]: string | boolean | string[]
} = {
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
}

async function compile(
  rootFile: string,
) {
  const crumpet = new Crumpets({
    rootFile,
    compilerOptions
  });

  // Overrite `write` function so instead of placing the transpiled file besides the source, we can move it into dist
  Crumpets.write = (filename: string, content: string) => {
    if (filename.includes(".d.ts")) {
      filename = filename.replace(".ts.d.ts", ".d.ts")
    }
    const distPath = filename.replace("/src/", "/dist/");
    const validWritablePath = fromFileUrl(distPath);
    try {
      Deno.writeFileSync(validWritablePath, encoder.encode(content));
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        const dirPathSplit = distPath.split("/");
        dirPathSplit.pop();
        const dirPath = dirPathSplit.join("/");
        Deno.mkdirSync(fromFileUrl(dirPath), { recursive: true });
        Deno.writeFileSync(validWritablePath, encoder.encode(content));
      }
    }
  };

  await crumpet.run();
}

async function watch() {
  const crumpets = new Crumpets({
    rootFile: "./src/mod.ts",
    directoryToWatch: "./src",
    compilerOptions
  })
  await crumpets.watch()
}

await compile("./src/mod.ts");
await compile("./src/examples_mod.ts")
if (Deno.args[0] === "--watch") {
  await watch()
}
