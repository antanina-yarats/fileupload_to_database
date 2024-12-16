import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import * as formController from "./controllers/formController.js";

const router = new Router();

router.get("/last-id", async ({ response }) => {
    try {
      const lastId = await lastUploadedId(); 
      response.body = { last_id: lastId }; 
    } catch (err) {
      console.error("Error fetching last uploaded ID:", err);
      response.status = 500;
      response.body = { error: "Internal server error." };
    }
  });
router.post("/upload", formController.uploadFile);
router.post("/files", formController.downloadFile);

export { router };
