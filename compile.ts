// transpile.ts
import { Crumpets } from "./deps.ts";

const compilerOptions: {
  [key: string]: string | boolean | string[];
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
};

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
if (Deno.args[0] === "--watch") {
  await watch();
}
