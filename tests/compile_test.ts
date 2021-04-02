/**
 * cwd must be root of this project, eg `~/destiny` but not `~/destiny/tests`
 */

import {listOfSourceCodeFiles} from "./utils";

Deno.test("Destiny can compile the source code", async () => {
  // Remove the `dist` directory as a pre-prep cleanup
  Deno.removeSync("./dist");

  // Run the compile script
  const p = Deno.run({
    cmd: ["npm", "run", "compile"],
    stdout: "null"
  });
  const status = await p.status();
  p.close();

  // TODO :: Ensure all files were created
  listOfSourceCodeFiles.forEach(filepath => {
    filepath = filepath.replace("src", "dist");
    // ...
  });

  // TODO :: Ensure that  the compiled files actually work and can be used
});