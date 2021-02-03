import { walkSync } from "./deps.ts"
const rootDir = "src"
const outDir = "dist"

// get dirs we need to create, and create them so they exist when we bundle the files from `src` into `dist`
{
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
  try {
    Deno.mkdirSync(outDir)
    console.info(`mkdir ${outDir}`)
    for (const dir of dirs) {
      Deno.mkdirSync(dir)
      console.info(`mkdir ${dir}`)
    }
  } catch (err) {
    // most likely the dir already exists. if so, thats ok.
    // TODO :: Check instance of error. If it's file already exists error then thats ok, we can pass. Else throw an error because we aren't expecting anything else
  }
}

{
// Bundle the files
  const cwd = Deno.cwd()
  for (const entry of walkSync(rootDir)) {
    if (entry.isFile === false) {
      continue // We only want to compile files
    }
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
