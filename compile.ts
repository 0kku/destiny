import { walkSync, existsSync } from "./deps.ts";
const rootDir = "src";
const outDir = "dist";
const encoder = new TextEncoder();
const cwd = Deno.cwd();

/**
 * For a given directory or file, compile it using `Deno.emit`, and place the generated content into same location, BUT under the `dist` directory
 *
 * @param fileOrDir - The file to compile. Must be within the `src` directory
 */
async function compileFileOrDir (fileOrDir: string): Promise<void> {
  // TODO :: Get diagnostics, handle if set
  const { files } = await Deno.emit(fileOrDir, {
    compilerOptions: {
      declaration: true,
      sourceMap: true,
      target: "es2020",
      module: "esnext",
      removeComments: true,
      downlevelIteration: true,
      useDefineForClassFields: true,
      strict: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      importsNotUsedAsValues: "remove", // is this right? it was "true" so im assuming that means allow them
      paths: {
        "/dist/*": ["src/*"],
      },
      "baseUrl": "./"
    }
  });
  const filenames = Object.keys(files);
  for (const filename of filenames) {
    const file = files[filename];
    let outPath = filename.replace(rootDir, outDir);
    outPath = "." + outPath.split(cwd)[1];
    Deno.writeFileSync(outPath, encoder.encode(file));
  }
  const filePathWithoutExt = filenames[0].split(".")[0]; // just grab the first one, it doesnt matter which, we're just getting the file without the ext
  const pathInDist = filePathWithoutExt.replace(rootDir, outDir);
  const prettyPath = `.${pathInDist.split(cwd)[1]}`;
  console.info(`create ${prettyPath}`);
}

// Keep variables out of scope
{
  // get dirs we need to create, and create them so they exist when we bundle the files from `src` into `dist`
  const dirs: Array<string> = [];
  for (const entry of walkSync(rootDir)) {
    if (entry.isDirectory) {
      if (entry.name === rootDir) {
        continue;
      }
      const dir = entry.path.replace(rootDir, outDir);
      dirs.push(dir);
    }
  }
  try {
    Deno.mkdirSync(outDir);
    console.info(`mkdir ${outDir}`);
    for (const dir of dirs) {
      Deno.mkdirSync(dir);
      console.info(`mkdir ${dir}`);
    }
  } catch (err) {
    // most likely the dir already exists. if so, thats ok. Otherwise, it's an unexpected error
    if (!err instanceof Deno.errors.AlreadyExists) {
      throw err;
    }
  }
}

// Bundle the files
for (const entry of walkSync(rootDir)) {
  if (entry.isFile === false) {
    continue; // We only want to compile files
  }
  const outPath = entry.path.replace(rootDir, outDir).replace(".ts", ".ts.js");
  // Only compile the file if it isn't already compiled
  if (existsSync(outPath) === false) {
    await compileFileOrDir(entry.path);
  }
}

// --watch support
const args = Deno.args;
if (args.includes("--watch")) {
  console.info("Watching...\n");
  for await (const event of Deno.watchFs(rootDir)) {
    // TODO :: For some reason, it sends 2 events for the same file with the same kind after an edit. For example i edit src/mod.ts. We get two events, so this logic will compile the file twice (which of course isn't needed)

    if (event.kind === "modify") {
      if (event.paths[0].endsWith("~")) {
        continue;
      }
      console.info(`Compiling ${event.paths[0]}...`);
      const path = event.paths[0];
      await compileFileOrDir(path);
      console.info("Done.\n");
    }
  }
}
