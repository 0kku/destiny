import { createServer } from "http";
import { promisify } from "util";
import { readFile } from "fs/promises";
import { JSHandle, Page, test as base } from "@playwright/test";

type TTestFixtures = {
  navigate: undefined,
  page: Page,
  destiny: JSHandle<typeof import("/dist/mod.js")>,
};

type TWorkerFixtures = {
  port: number,
  server: undefined,
};

const test = base.extend<TTestFixtures, TWorkerFixtures>({
  port: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, workerInfo) => {
      await use(9090 + workerInfo.workerIndex);
    },
    { scope: "worker" },
  ],
  server: [
    async ({port}, use) => {
      const server = createServer();

      server.on("request", (req, res) => {
        if (req.url === "/") {
          res.setHeader("Content-Type", "text/html");
          res.write("<html><body></body></html>", "utf8");
          res.end();
          return;
        }

        if (!req.url || !req.url.startsWith("/")) {
          res.writeHead(404);
          res.end();
          return;
        }

        const url = new URL(`../../${req.url.slice(1)}`, import.meta.url);

        void readFile(url)
        .then(file => {
          res.setHeader("Content-Type", "text/javascript");
          res.write(file);
          res.end();
        })
        .catch(() => {
          res.writeHead(404);
          res.end();
        });
      });

      await new Promise((resolve, reject) => {
        server.on("error", reject);

        server.listen(port, () => {
          server.off("error", reject);
          resolve(undefined);
        });
      });

      await use(undefined);

      return promisify((cb: (err?: Error) => void) => server.close(cb));
    },
    { scope: "worker", auto: true },
  ],

  page: async ({browser, port}, use) => {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}/`);

    await use(page);
  },

  destiny: async ({page}, use) => {
    const destiny = await page.evaluateHandle(() => import("/dist/mod.js"));

    await use(destiny);
  },
});

export default test;
