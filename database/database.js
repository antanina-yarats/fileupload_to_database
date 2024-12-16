import postgres from "https://deno.land/x/postgresjs@v3.4.2/mod.js";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config({ path: "./project.env" });
console.log("Loaded environment variables:", env);

console.log("Database configuration:");
console.log({
  host: Deno.env.get("POSTGRES_HOST"),
  port: Deno.env.get("POSTGRES_PORT"),
  database: Deno.env.get("POSTGRES_DB"),
  username: Deno.env.get("POSTGRES_USER"),
  ssl: true, 
});


const sql = postgres({
    host: env.POSTGRES_HOST,
    port: Number(env.POSTGRES_PORT),
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    ssl: true,
  });

export { sql };
