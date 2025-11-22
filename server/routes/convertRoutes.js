const express = require("express");
const multer = require("multer");
const router = express.Router();
const convertController = require("../controllers/convertController");

const upload = multer({ dest: "uploads/" });

// Image(s) → PDF
router.post("/imgs-to-pdf", upload.array("files"), convertController.imgsToPdf);

// PDF → Word
router.post("/pdf-to-word", upload.single("file"), convertController.pdfToWord);

// Word → PDF
router.post("/word-to-pdf", upload.single("file"), convertController.wordToPdf);

module.exports = router;
