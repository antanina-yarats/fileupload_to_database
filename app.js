import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { router } from "./routes/routes.js";

const app = new Application();

// Test write access to /tmp
try {
  const testFile = "/tmp/test-file";
  await Deno.writeTextFile(testFile, "This is a test.");
  console.log("Write access to /tmp confirmed!");
  await Deno.remove(testFile);
} catch (err) {
  console.error("Error writing to /tmp:", err);
}

app.use(errorMiddleware);
app.use(renderMiddleware);
app.use(router.routes());

console.log("Listening on http://localhost:7777");
app.listen({ port: 7777 });
