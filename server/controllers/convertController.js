const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { pipeline } = require("stream");
const { promisify } = require("util");
const pump = promisify(pipeline);

/**
 * Image(s) → PDF
 */
exports.imgsToPdf = async (req, res) => {
  try {
    const quality = req.query.quality || 85;
    const form = new FormData();

    req.files.forEach(f => {
      form.append("files", fs.createReadStream(path.resolve(f.path)), f.originalname);
    });

    const response = await axios.post(
      `http://localhost:8000/imgs-to-pdf?quality=${quality}`,
      form,
      { headers: form.getHeaders(), responseType: "stream" }
    );

    res.setHeader("Content-Disposition", "attachment; filename=combined.pdf");
    response.data.pipe(res);

    response.data.on("end", () => {
      req.files.forEach(f => fs.unlink(f.path, () => {}));
    });

  } catch (err) {
    console.error("Error in /convert/imgs-to-pdf:", err.message || err);
    res.status(500).send("Conversion failed");
  }
};

/**
 * PDF → Word
 */
exports.pdfToWord = async (req, res) => {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(path.resolve(req.file.path)), req.file.originalname);

    const response = await axios.post(
      "http://localhost:8000/pdf-to-word",
      form,
      { headers: form.getHeaders(), responseType: "stream" }
    );

    res.setHeader("Content-Disposition", "attachment; filename=converted.docx");
    response.data.pipe(res);

    response.data.on("end", () => fs.unlink(req.file.path, () => {}));

  } catch (err) {
    console.error("PDF → Word Error:", err.message);
    res.status(500).send("Conversion failed");
  }
};

/**
 * Word → PDF
 */
exports.wordToPdf = async (req, res) => {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(path.resolve(req.file.path)), req.file.originalname);

    const response = await axios.post(
      "http://localhost:8000/word-to-pdf",
      form,
      { headers: form.getHeaders(), responseType: "stream" }
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="converted.pdf"');

    await pump(response.data, res);
    fs.unlink(req.file.path, () => {});

  } catch (err) {
    console.error("Word → PDF Error:", err.message);
    res.status(500).send("Conversion failed");
  }
};
