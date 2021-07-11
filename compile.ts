// transpile.ts
import { Crumpets } from "./deps.ts";

const compilerOptions = (JSON.parse(Deno.readTextFileSync("./tsconfig.json"))).compilerOptions

async function compile(
  rootFile: string,
) {
  const crumpet = new Crumpets({
    rootFile,
    compilerOptions,
    filenameReplaceOptions: {
      search: "/src/",
      replacer: "/dist/",
    },
  });

  await crumpet.run();
}

async function watch() {
  const crumpets = new Crumpets({
    rootFile: "./src/mod.ts",
    directoryToWatch: "./src",
    compilerOptions,
  });
  await crumpets.watch()
}

await Promise.all([
  "./src/mod.ts",
  "./src/examples_mod.ts",
].map(compile));
if (Deno.args.includes("--watch")) {
  await watch();
}
