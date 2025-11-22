from pdf2docx import Converter
from docx2pdf import convert as docx2pdf_convert
import shutil
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse, FileResponse
from typing import List, Optional
from PIL import Image
import img2pdf
import io
import uuid
import os

app = FastAPI()

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.post("/img-to-pdf")
async def img_to_pdf(file: UploadFile = File(...)):
    # existing single-image endpoint (unchanged)
    filename = f"{uuid.uuid4()}_{file.filename}"
    image_path = os.path.join(UPLOAD_DIR, filename)
    with open(image_path, "wb") as f:
        f.write(await file.read())
    pdf_path = os.path.join(OUTPUT_DIR, filename.split('.')[0] + ".pdf")
    with open(pdf_path, "wb") as f:
        f.write(img2pdf.convert(image_path))
    return FileResponse(pdf_path, media_type='application/pdf', filename="converted.pdf")

@app.post("/imgs-to-pdf")
async def imgs_to_pdf(files: List[UploadFile] = File(...), quality: Optional[int] = 85):
    """
    Accept multiple image files and an optional 'quality' query param (10-100).
    Returns a single combined PDF.
    """
    # clamp quality
    if quality < 10:
        quality = 10
    if quality > 100:
        quality = 100

    # convert each image to compressed JPEG in-memory
    image_bytes_list = []
    for upload in files:
        contents = await upload.read()
        try:
            img = Image.open(io.BytesIO(contents))
            # ensure RGB for JPEG
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            buf = io.BytesIO()
            # Save as JPEG into buffer with requested quality
            img.save(buf, format="JPEG", quality=quality, optimize=True)
            buf.seek(0)
            image_bytes_list.append(buf.read())
        except Exception as e:
            # if pillow can't open, just try to pass the original bytes (let img2pdf handle)
            image_bytes_list.append(contents)

    # Combine into single PDF using img2pdf
    pdf_bytes = img2pdf.convert(image_bytes_list)
    out_filename = f"{uuid.uuid4()}.pdf"
    out_path = os.path.join(OUTPUT_DIR, out_filename)
    with open(out_path, "wb") as f:
        f.write(pdf_bytes)

    # return as streaming response
    return FileResponse(out_path, media_type="application/pdf", filename="combined.pdf")

@app.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}_{file.filename}"
    pdf_path = os.path.join(UPLOAD_DIR, filename)

    with open(pdf_path, "wb") as f:
        f.write(await file.read())

    docx_filename = filename.replace(".pdf", ".docx")
    docx_path = os.path.join(OUTPUT_DIR, docx_filename)

    try:
        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()
    except Exception as e:
        return {"error": str(e)}

    return FileResponse(
        docx_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="converted.docx"
    )

@app.post("/word-to-pdf")
async def word_to_pdf(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}_{file.filename}"
    docx_path = os.path.join(UPLOAD_DIR, filename)

    with open(docx_path, "wb") as f:
        f.write(await file.read())

    pdf_filename = filename.replace(".docx", ".pdf")
    pdf_path = os.path.join(OUTPUT_DIR, pdf_filename)

    try:
        docx2pdf_convert(docx_path, pdf_path)
        # check if file was created and has content
        if not os.path.exists(pdf_path) or os.path.getsize(pdf_path) == 0:
            return {"error": "PDF conversion failed or produced empty file."}
    except Exception as e:
        return {"error": str(e)}

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="converted.pdf"
    )

