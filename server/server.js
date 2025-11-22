const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const { pipeline } = require("stream");
const { promisify } = require("util");
const pump = promisify(pipeline);

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

// app.post("/convert/pdf-to-word", upload.single("file"), async (req, res) => {
//   try {
//     const form = new FormData()
//     form.append("file", fs.createReadStream(req.file.path))

//     const response = await axios.post("http://localhost:8000/pdf-to-word", form, {
//       headers: form.getHeaders(),
//       responseType: "stream"
//     })

//     res.setHeader("Content-Disposition", "attachment; filename=converted.docx")
//     response.data.pipe(res)

//     response.data.on("end", () => {
//       fs.unlink(req.file.path, () => {})
//     })

//   } catch (err) {
//     console.error(err)
//     res.status(500).send("PDF to Word conversion failed")
//   }
// })


// const newLocal = app.post("/convert/word-to-pdf", upload.single("file"), async (req, res) => {
//   try {
//     const form = new FormData();
//     form.append("file", fs.createReadStream(req.file.path));

//     const response = await axios.post("http://localhost:8000/word-to-pdf", form, {
//       headers: form.getHeaders(),
//       responseType: "stream"
//     });

//     res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");
//     response.data.pipe(res);

//     response.data.on("end", () => {
//       fs.unlink(req.file.path, () => { });
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Word to PDF conversion failed");
//   }
// });

/**
 * PDF → WORD
 */
app.post("/convert/pdf-to-word", upload.single("file"), async (req, res) => {
  try {
    const form = new FormData();

    form.append(
      "file",
      fs.createReadStream(path.resolve(req.file.path)),
      req.file.originalname
    );

    const response = await axios.post(
      "http://localhost:8000/pdf-to-word",
      form,
      {
        headers: form.getHeaders(),
        responseType: "stream"
      }
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=converted.docx"
    );

    response.data.pipe(res);

    response.data.on("end", () => {
      fs.unlink(req.file.path, () => {});
    });

  } catch (error) {
    console.error("PDF → Word Error:", error.message);
    res.status(500).send("Conversion failed");
  }
});


/**
 * WORD → PDF
 */
// app.post("/convert/word-to-pdf", upload.single("file"), async (req, res) => {
//   try {
//     const form = new FormData();

//     form.append(
//       "file",
//       fs.createReadStream(path.resolve(req.file.path)),
//       req.file.originalname
//     );

//     const response = await axios.post(
//       "http://localhost:8000/word-to-pdf",
//       form,
//       {
//         headers: form.getHeaders(),
//         responseType: "stream"
//       }
//     );

//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=converted.pdf"
//     );

//     response.data.pipe(res);

//     response.data.on("end", () => {
//       fs.unlink(req.file.path, () => {});
//     });

//   } catch (error) {
//     console.error("Word → PDF Error:", error.message);
//     res.status(500).send("Conversion failed");
//   }
// });

app.post("/convert/word-to-pdf", upload.single("file"), async (req, res) => {
  try {
    const form = new FormData();

    form.append(
      "file",
      fs.createReadStream(path.resolve(req.file.path)),
      req.file.originalname
    );

    const response = await axios.post(
      "http://localhost:8000/word-to-pdf",
      form,
      {
        headers: form.getHeaders(),
        responseType: "stream"
      }
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="converted.pdf"`);

    // ✅ SAFER pipeline
    await pump(response.data, res);

    fs.unlink(req.file.path, () => {});

  } catch (error) {
    console.error("Word → PDF Error:", error.message);
    res.status(500).send("Conversion failed");
  }
});



app.listen(5000, () => console.log("Node server running on http://localhost:5000"));



