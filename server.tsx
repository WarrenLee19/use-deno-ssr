import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { React, ReactDOMServer } from "./dep.ts";

import App from "./app.tsx";

const app = new Application();

const router = new Router();
router.get("/", handlePage);

let games: Map<number, any> = new Map();

function init() {
   games.set(games.size + 1, { id: Date.now(), level: "最强王者",title:'Bin Ren'});
   games.set(games.size + 1, { id: Date.now(), level: "最强王者",title:'Small Ma'});
   games.set(games.size + 1, { id: Date.now(), level: "最强王者",title:'Shooter V'});
   games.set(games.size + 1, { id: Date.now(), level: "倔强青铜",title:'WarrenLee' });
}
init();
router
  .get("/games", (context: any) => {
    context.response.body = Array.from(games.values());
  })
  .get("/games/:id", (context: any) => {
    if (
      context.params &&
      context.params.id &&
      games.has(Number(context.params.id))
    ) {
      context.response.body = games.get(Number(context.params.id));
    } else {
      context.response.status = 404;
    }
  })
  .post("/games", async (context: any) => {
    const body = context.request.body();
    if (body.type === "json") {
      const game = await body.value;
      games.set(Date.now(), game);
    }
    context.response.body = { status: "OK" };
  });

const { files } = await (Deno as any).emit("./client.tsx", { bundle: "module" });
const clientJS = files["deno:///bundle.js"] || "";

const serverrouter = new Router();
serverrouter.get("/static/client.js", (context: any) => {
  context.response.headers.set("Content-Type", "text/html");
  context.response.body = clientJS;
});
app.use(router.routes());
app.use(serverrouter.routes());

app.use(router.allowedMethods());

console.log("server is running on http://localhost:8000/");
await app.listen({ port: 8000 });

function handlePage(ctx: any) {
  try {
    const body = ReactDOMServer.renderToString(
      <App games={[]} /> // change here to pass games as props
    );
    ctx.response.body = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <title>Document</title>
    <script>
      window.__INITIAL_STATE__ = {"games": ${JSON.stringify(
        Array.from(games.values())
      )}};
    </script>
  </head>
  <body >
    <div id="root">${body}</div>
    <script  src="http://localhost:8000/static/client.js" defer></script>
  </body>
  </html>`;
  } catch (error) {
    console.error(error);
  }
}
