import { walkSync } from "./deps.ts"
const rootDir = "src"
const outDir = "dist"

// get dirs we need to create
const dirs: string[] = []
for (const entry of walkSync(rootDir)) {
  if (entry.isDirectory) {
    if (entry.name === rootDir) {
      continue
    }
    const dir = entry.path.replace(rootDir, outDir)
    dirs.push(dir)
  }
}

// Make those dirs so we can move the bundled files across
try {
  Deno.mkdirSync(outDir)
  console.info(`mkdir ${outDir}`)
} catch (e) {
  // ...
}
for (const dir of dirs) {
  try {
    Deno.mkdirSync(dir)
    console.info(`mkdir ${dir}`)
  } catch (e) {
    // ...
  }
}

// Bundle the files
const cwd = Deno.cwd()
for (const entry of walkSync(rootDir)) {
  if (entry.isFile === true) {
    const {files} = await Deno.emit(entry.path, {
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
    })
    const filenames = Object.keys(files)
    for (const filename of filenames) {
      const file = files[filename]
      let outPath = filename.replace(rootDir, outDir)
      outPath = "." + outPath.split(cwd)[1]
      Deno.writeFileSync(outPath, new TextEncoder().encode(file))
    }
    const filePathWithoutExt = filenames[0].split(".")[0] // just grab the first one, it doesnt matter which, we're just getting the file without the ext
    const pathInDist = filePathWithoutExt.replace(rootDir, outDir)
    const prettyPath = `.${pathInDist.split(cwd)[1]}`
    console.info(`create ${prettyPath}`)
  }
}
