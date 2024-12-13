import { sql } from "../database/database.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const lastUploadedId = async () => {
  const rows = await sql`SELECT MAX(id) as max_id FROM miniupload_files`;
  return rows.length === 1 ? rows[0].max_id : -1;
};


const storeFile = async (fileName, contentType, data, password) => {
  const hashedPassword = await bcrypt.hash(password); 

  try {
    const result = await sql`
      INSERT INTO miniupload_files (name, type, data, password)
      VALUES (${fileName}, ${contentType}, ${data}, ${hashedPassword})
      RETURNING id;
    `;
    console.log("Inserted File ID:", result[0].id);
    return result[0].id;
  } catch (err) {
    console.error("Database Insertion Error:", err);
    throw err;
  }
};


const retrieveFile = async (id) => {
  const rows = await sql`SELECT * FROM miniupload_files WHERE id = ${id}`;
  return rows.length === 1 ? rows[0] : null;
};


const verifyPassword = async (hashedPassword, plaintextPassword) => {
  return await bcrypt.compare(plaintextPassword, hashedPassword);
};

export { lastUploadedId, storeFile, retrieveFile, verifyPassword };
