import { ensureDirSync, fromFileUrlWin, relativeWin } from "./deps.ts";

const encoder = new TextEncoder();

async function emit(file: string): Promise<{
  diagnostics: string;
  files: Record<string, string>;
}> {
  const { diagnostics, files } = await Deno.emit(file, {
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
  const formattedDiagnostics = Deno.formatDiagnostics(diagnostics);
  return {
    diagnostics: formattedDiagnostics,
    files,
  };
}

/**
 * Write a file to the dist directory. Replaces the following in the `filename`:
 *   - `src` with `dist`
 *   - `.ts.d.ts` with `.d.ts`
 *   - `.ts.js` with `.js`
 *
 * @param filename The file url of an emitted file. Must be the result of `emit`
 * @param fileContent - The file content associated with `files[filename]`
 */
function write(filename: string, fileContent: string): void {
  const outPath = filename.replace("src", "dist").replace(".ts.js", ".js")
    .replace(".ts.d.ts", ".d.ts");
  if (outPath.endsWith(".d.ts") || outPath.endsWith(".js")) { // ensure directory(s) file is in, exists
    const pathSplit = outPath.split("/");
    pathSplit.pop();
    const parentDirOfFile = pathSplit.join("/");
    const validPath = Deno.build.os === "windows"
      ? fromFileUrlWin(parentDirOfFile)
      : parentDirOfFile; // because `ensureDirSync` will throw an error if the path is a file url on windows
    ensureDirSync(validPath);
  }

  // Because imports inside the files are still using a .ts extension, we're going to make them use .js:
  fileContent = fileContent.replace(
    /import { ([a-zA-Z].*) } from "(.*)";/gm,
    (_str, importValues, fileImportedFrom) => {
      const jsImport = fileImportedFrom.replace(".ts", ".js");
      return `import { ${importValues} } from \"${jsImport}\";`;
    },
  );
  fileContent = fileContent.replace(
    /export { ([a-zA-Z].*) } from "(.*)";/gm,
    (_str, importValues, fileImportedFrom) => {
      const jsImport = fileImportedFrom.replace(".ts", ".js");
      return `export { ${importValues} } from \"${jsImport}\";`;
    },
  );
  fileContent = fileContent.replace(
    /import \"(.*)\";/gm,
    (_str, importValue) => {
      const jsRef = importValue.replace(".ts", ".js");
      return `import \"${jsRef}\";`;
    },
  );
  fileContent = fileContent.replace(
    /import\(\"(.*)\"\)/gm,
    (_str, importValue) => {
      const jsRef = importValue.replace(".ts", ".js");
      return `import(\"${jsRef}\")`;
    },
  );
  /// <amd-module name="file:///D:/Development/ebebbington/destiny/src/mod.ts" />

  const validPath = Deno.build.os === "windows"
    ? fromFileUrlWin(outPath)
    : outPath; // Same again
  Deno.writeFileSync(
    validPath,
    encoder.encode(fileContent),
  );
}

async function compile(file: string): Promise<string | void> {
  const { diagnostics, files } = await emit(file);

  if (diagnostics !== "") {
    return diagnostics;
  }

  const fileKeys = Object.keys(files).filter((filename) => {
    if (filename.includes(".map")) {
      return false;
    }
    return true;
  });

  // Write file
  for (const filename of fileKeys) {
    write(filename, files[filename]);
  }
}

const watchTimeouts: Record<string, number> = {};
function debounce(context: string, fn: () => Promise<void>) {
  if (watchTimeouts[context]) {
    clearTimeout(watchTimeouts[context]);
  }
  watchTimeouts[context] = setTimeout(function () {
    fn();
  }, 100);
}

//
//
//

console.log("Starting compilation...");

const errorMsg = await compile("./src/mod.ts");
if (errorMsg) {
  console.error(errorMsg);
  Deno.exit(1);
}
console.log("Finished compilation");

const args = Deno.args;
if (args[0] === "--watch") {
  console.log("Watching...");
  const watcher = Deno.watchFs("./src");
  for await (const event of watcher) {
    if (event.kind !== "modify") {
      continue;
    }
    const paths = event.paths;
    const path = Deno.build.os === "windows"
      ? relativeWin(".", paths[0])
      : paths[0];
    debounce(path, async () => {
      const msg = await compile(path);
      if (msg) {
        console.error(msg);
      } else {
        console.log("Compiled " + path);
      }
    });
  }
}
