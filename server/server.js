const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

/**
 * Accept multiple files (field name: 'files') and optional quality query param.
 * Forwards them to Python microservice at /imgs-to-pdf and streams back the combined PDF.
 */
app.post("/convert/imgs-to-pdf", upload.array("files"), async (req, res) => {
  try {
    const quality = req.query.quality || 85;
    const form = new FormData();

    // append each file stream to form
    req.files.forEach((f) => {
      form.append("files", fs.createReadStream(path.resolve(f.path)), f.originalname);
    });

    const response = await axios.post(`http://localhost:8000/imgs-to-pdf?quality=${quality}`, form, {
      headers: form.getHeaders(),
      responseType: "stream"
    });

    res.setHeader("Content-Disposition", "attachment; filename=combined.pdf");
    response.data.pipe(res);

    // optional: cleanup uploaded temp files after stream ends
    response.data.on("end", () => {
      req.files.forEach((f) => {
        fs.unlink(f.path, () => {});
      });
    });

  } catch (err) {
    console.error("Error in /convert/imgs-to-pdf:", err.message || err);
    res.status(500).send("Conversion failed");
  }
});

app.listen(5000, () => console.log("Node server running on http://localhost:5000"));



