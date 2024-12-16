import { lastUploadedId, storeFile, retrieveFile, verifyPassword } from "../../services/fileService.js";
import * as base64 from "https://deno.land/x/base64@v0.2.1/mod.ts";
import { readAll } from "https://deno.land/std@0.205.0/streams/mod.ts";



const viewForm = async ({ render }) => {
  console.log("Rendering form...");
  const lastId = await lastUploadedId();
  console.log("Last uploaded ID:", lastId);
  render("index.eta", {
    last_id: lastId,
  });
};


const uploadFile = async ({ request, response }) => {
  console.log("Processing file upload...");
  const body = request.body({ type: "form-data" });

  let reader;
  try {
    reader = await body.value;
  } catch (err) {
    console.error("Error parsing form-data:", err);
    response.status = 400;
    response.body = { error: "Invalid form data." };
    return;
  }

  const data = await reader.read();
  const fileDetails = data.files[0];

  if (!fileDetails) {
    console.error("No file uploaded.");
    response.status = 400;
    response.body = { error: "No file uploaded." };
    return;
  }
  console.log("File Details:", fileDetails);

  let fileContents;
  try {
    console.log("Attempting to read file:", fileDetails.filename);
    const file = await Deno.open(fileDetails.filename);
    fileContents = await readAll(file);
    file.close();
    console.log("File Contents Length:", fileContents.length);
  } catch (err) {
    console.error("Error processing file:", err);
    response.status = 500;
    response.body = { error: "Failed to process uploaded file." };
    return;
  }

  const base64Encoded = base64.fromUint8Array(fileContents);
  console.log("Base64 Encoded Length:", base64Encoded.length);

  const pw = `${Math.floor(100000 * Math.random())}`;
  console.log("Generated Password:", pw);

  try {
    console.log("Inserting into database:", {
      name: fileDetails.originalName,
      type: fileDetails.contentType,
      size: base64Encoded.length,
      password: pw,
    });
    await storeFile(fileDetails.originalName, fileDetails.contentType, base64Encoded, pw);
    console.log("File successfully stored in database.");
  } catch (err) {
    console.error("Error inserting file into database:", err);
    response.status = 500;
    response.body = { error: "Database error." };
    return;
  }

  response.status = 201;
  response.body = { message: "File uploaded successfully.", password: pw };
};

const downloadFile = async ({ request, response }) => {
  console.log("Processing file download...");
  const body = request.body({ type: "form" });

  let params;
  try {
    params = await body.value;
  } catch (err) {
    console.error("Error parsing form data:", err);
    response.status = 400;
    response.body = "Invalid form data.";
    return;
  }

  const id = params.get("id");
  const password = params.get("password");

  if (!id || !password) {
    console.error("Missing file ID or password.");
    response.status = 400;
    response.body = "Missing file ID or password.";
    return;
  }
  console.log("Received file ID:", id, "and password.");

 
  let file;
  try {
    file = await retrieveFile(id);
  } catch (err) {
    console.error("Error retrieving file from database:", err);
    response.status = 500;
    response.body = "Internal server error.";
    return;
  }

  if (!file) {
    console.error("File not found for ID:", id);
    response.status = 404;
    response.body = "File not found.";
    return;
  }
  console.log("File retrieved:", file);


  let passwordMatches;
  try {
    passwordMatches = await verifyPassword(file.password, password);
  } catch (err) {
    console.error("Error verifying password:", err);
    response.status = 500;
    response.body = "Internal server error.";
    return;
  }

  if (!passwordMatches) {
    console.error("Unauthorized access for file ID:", id);
    response.status = 401;
    response.body = "Unauthorized.";
    return;
  }
  console.log("Password verified successfully.");

 
  try {
    const fileData = base64.toUint8Array(file.data);
    console.log("Decoded file data length:", fileData.length);

    response.headers.set("Content-Type", file.type);
    response.headers.set("Content-Length", fileData.length.toString());
    response.body = fileData;
    console.log("File sent successfully.");
  } catch (err) {
    console.error("Error sending file:", err);
    response.status = 500;
    response.body = "Internal server error.";
  }
};

export { viewForm, uploadFile, downloadFile };
