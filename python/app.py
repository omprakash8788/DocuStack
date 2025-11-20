from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import img2pdf
import os
import uuid

app = FastAPI()

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.post("/img-to-pdf")
async def img_to_pdf(file: UploadFile = File(...)):

    filename = f"{uuid.uuid4()}_{file.filename}"
    image_path = os.path.join(UPLOAD_DIR, filename)

    with open(image_path, "wb") as f:
        f.write(await file.read())

    pdf_path = os.path.join(OUTPUT_DIR, filename.split('.')[0] + ".pdf")

    with open(pdf_path, "wb") as f:
        f.write(img2pdf.convert(image_path))

    return FileResponse(pdf_path, media_type='application/pdf', filename="converted.pdf")
