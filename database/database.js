import postgres from "https://deno.land/x/postgresjs@v3.4.2/mod.js";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config({ path: "./project.env" });
console.log("Loaded environment variables:", env);



const sql = postgres({
    host: env.POSTGRES_HOST,
    port: Number(env.POSTGRES_PORT),
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    ssl: true,
  });

export { sql };
