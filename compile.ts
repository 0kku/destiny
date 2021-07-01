// transpile.ts
import { Crumpets, fromFileUrlUnix, fromFileUrlWin } from "./deps.ts";

const fromFileUrl = Deno.build.os === "windows"
  ? fromFileUrlWin
  : fromFileUrlUnix;
const encoder = new TextEncoder();

async function compile(
  rootFile: string,
  directoryToWatch: string,
  watch: boolean,
) {
  const crumpet = new Crumpets({
    rootFile,
    startWebSocketServer: true,
    directoryToWatch,
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
  Crumpets.write = (filename: string, content: string) => {
    console.log(filename);
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

  if (watch) {
    await crumpet.watch();
  }
}

const directoryToWatch = "./src"
await compile("./src/mod.ts", directoryToWatch, false);
await compile("./src/examples_mod.ts", directoryToWatch, Deno.args[0] === "--watch")
