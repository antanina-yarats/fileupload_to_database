import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

import { router } from "./routes/routes.js";

const app = new Application();

app.use(errorMiddleware);
app.use(renderMiddleware);

app.use(router.routes());

console.log("Listening on http://localhost:7777");
app.listen({ port: 7777 });
