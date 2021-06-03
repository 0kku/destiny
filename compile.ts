import { ensureDirSync, fromFileUrlWin, relativeWin } from "./deps.ts";

const encoder = new TextEncoder();

function checkDiagnostics(diagnostics: Deno.Diagnostic[]): string | void {
  // Check if there were errors when bundling the clients code
  if (diagnostics && diagnostics.length) {
    const diagnostic = diagnostics[0]; // we only really care about throwing the first error
    const filename = diagnostic.fileName;
    const start = diagnostic.start;
    const messageText = diagnostic.messageText ??
      // @ts-ignore Deno tells us `messageText` does not exist on `messageChain`, but it 100% is (bug with deno)
      diagnostic.messageChain!.messageText;
    const sourceLine = diagnostic.sourceLine;
    const brief = diagnostic.messageChain
      ? // @ts-ignore Deno tells us `messageText` does not exist on `messageChain`, but it 100% is (bug with deno)
        diagnostic.messageChain.next![0].messageText
      : "";
    if (filename && start) {
      return `${filename}:${start.line}:${start.character} - ${messageText}\n${brief}\n${sourceLine}\n`;
    } else {
      return `${messageText}\n${brief}\n`;
    }
  }
}

async function emit(file: string): Promise<{
  diagnostics: Deno.Diagnostic[];
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
  return {
    diagnostics,
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

  const errorMsg = checkDiagnostics(diagnostics);
  if (errorMsg) {
    return errorMsg;
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
  console.log("Finished compilation");
}

//
//
//

console.log("Starting compilation...");

const errorMsg = await compile("./src/mod.ts");
if (errorMsg) {
  throw new Error(errorMsg);
}

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
    const msg = await compile(path);
    if (msg) {
      console.error(msg);
    } else {
      console.log("Compiled " + path);
    }
  }
}
