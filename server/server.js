const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/convert/img-to-pdf", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    const fileStream = fs.createReadStream(req.file.path);

    formData.append("file", fileStream);

    const response = await axios.post(
      "http://localhost:8000/img-to-pdf",
      formData,
      { headers: formData.getHeaders(), responseType: "stream" }
    );

    res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");

    response.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Conversion failed");
  }
});

app.listen(5000, () => {
  console.log("Node server running on http://localhost:5000");
});
