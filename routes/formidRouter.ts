import { Router, Request, Response } from "express";
import { Formidable } from "formidable";
import { prepareDir, fname } from "../utils/utilityFunctions";
import path from "path";

const formidRouter = Router();

formidRouter.get("/", async (req: Request, res: Response) => {
  try {
    res.send(`
    <h2>Upload Files (Max 3) with Formidable & TypeScript</h2>
    <form action="/upload" enctype="multipart/form-data" method="post">
      <div>Text Field: <input type="text" name="title" /></div>
      
      <!-- Allow multiple files -->
      <div>File: <input type="file" name="myFile" multiple /></div>
      
      <input type="submit" value="Upload" />
    </form>
  `);
  } catch (error) {
    console.error("Error occured:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

formidRouter.post("/", async (req: Request, res: Response) => {
  try {
    const form = new Formidable({
      uploadDir: prepareDir(),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5 MB per file
      allowEmptyFiles: false,

      filename: (name, ext, part, form) => {
        return fname(ext, `${part.originalFilename}`); // your custom filename function
        // THE EXT WILL BE USED TO FILTER allowedExt BELOW
      },

      filter: function ({ originalFilename, mimetype }) {
        const allowedExt = [".jpg", ".jpeg", ".png", ".pdf"];
        const allowedMime = ["image/jpeg", "image/png", "application/pdf"];
        const ext = path.extname(originalFilename || "").toLowerCase();

        if (!allowedExt.includes(ext)) {
          console.log("❌ Blocked by extension:", ext, originalFilename);
          return false;
        }

        if (!allowedMime.includes(mimetype || "")) {
          console.log("❌ Blocked by MIME:", mimetype);
          return false;
        }
        return true;
      },
    });

    // Limit number of files
    let fileCount = 0;
    const MAX_FILES = 3;

    form.on("fileBegin", (name, file) => {
      if (fileCount >= MAX_FILES) {
        console.log("❌ Extra file blocked: ", file.originalFilename);
        return (form as any)._error(new Error("Only 3 files allowed"));
      }
      fileCount++;
      console.log("Uploading:", file.originalFilename, name); // THIS NAME IS <IMAGE> WHICH IS PARAMETER FROM POSTMAN
    });

    form.on("error", () => req.resume()); // avoid socket hang-up

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Upload Error:", err.message);
        return res.status(400).json({ error: err.message });
      }
      const isFileAttached = Object.keys(files).length > 0;
      const isDataAttached =
        Array.isArray(fields.data) &&
        Object.keys(JSON.parse(fields.data[0].toString())).length > 0;

      console.log("file attached:", isFileAttached);
      console.log("data attached:", isDataAttached);

      if (isFileAttached) {
        res.status(200).json({
          message: "Data uploaded.",
          count: fileCount,
          files,
        });
      } else {
        res.status(200).json({
          message: "Data uploaded.",
          count: fileCount,
          files,
        });
      }
    });
  } catch (error) {
    console.error("Error occured:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default formidRouter;
