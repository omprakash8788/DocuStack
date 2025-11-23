import React, { useRef, useState } from "react"
import "./App.css"

import Tabs from "./components/Tabs"
import Dropzone from "./components/Dropzone"
import ImageList from "./components/ImageList"
import SingleFileUpload from "./components/SingleFileUpload"
import ProgressBar from "./components/ProgressBar"

import { useUploader } from "./hooks/useUploader"
import {
  isImage,
  isPDF,
  isDOCX,
  downloadBlob,
} from "./utils/fileHelpers"

import {
  convertImagesToPdf,
  pdfToWord,
  wordToPdf,
} from "./services/convert.service"

const App = () => {
  const [files, setFiles] = useState<File[]>([])
  const [singleFile, setSingleFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [quality, setQuality] = useState(85)
  const [mode, setMode] = useState("img-to-pdf")

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { loading, progress, setLoading, setProgress } =
    useUploader()

  const onFilesSelected = (fileList: FileList) => {
    const arr = Array.from(fileList).filter(isImage)
    setFiles((prev) => [...prev, ...arr])
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    onFilesSelected(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleConvert = async () => {
    if (!files.length) return alert("Add at least one image")

    const form = new FormData()
    files.forEach((f) => form.append("files", f))

    try {
      setLoading(true)
      const res = await convertImagesToPdf(
        form,
        quality,
        setProgress
      )
      downloadBlob(res.data, "combined.pdf")
    } finally {
      setLoading(false)
    }
  }

  const handlePdfToWord = async () => {
    if (!singleFile || !isPDF(singleFile))
      return alert("Upload a valid PDF")

    const form = new FormData()
    form.append("file", singleFile)

    try {
      setLoading(true)
      const res = await pdfToWord(form, setProgress)
      downloadBlob(res.data, "converted.docx")
    } finally {
      setLoading(false)
    }
  }

  const handleWordToPdf = async () => {
    if (!singleFile || !isDOCX(singleFile))
      return alert("Upload a DOCX")

    const form = new FormData()
    form.append("file", singleFile)

    try {
      setLoading(true)
      const res = await wordToPdf(form, setProgress)
      downloadBlob(res.data, "converted.pdf")
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) return "📕"
    if (file.type.includes("word")) return "📘"
    if (file.type.includes("image")) return "🖼️"
    return "📄"
  }

  return (
    <div className="app">
      <h1>Smart File Converter</h1>

      <Tabs mode={mode} setMode={setMode} />

      {mode === "img-to-pdf" && (
        <>
          <Dropzone
            dragOver={dragOver}
            setDragOver={setDragOver}
            onDrop={handleDrop}
            onChange={(e) =>
              e.target.files &&
              onFilesSelected(e.target.files)
            }
            inputRef={fileInputRef}
          />

          <ImageList
            files={files}
            removeFile={removeFile}
          />

          <div className="controls">
            <label>Quality: {quality}</label>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) =>
                setQuality(Number(e.target.value))
              }
            />
          </div>

          <button onClick={handleConvert} disabled={loading}>
            {loading ? "Converting..." : "Convert to PDF"}
          </button>
        </>
      )}

      {(mode === "pdf-to-word" ||
        mode === "word-to-pdf") && (
        <>
          <SingleFileUpload
            singleFile={singleFile}
            setSingleFile={setSingleFile}
            getFileIcon={getFileIcon}
          />

          {mode === "pdf-to-word" && (
            <button onClick={handlePdfToWord}>
              Convert PDF → Word
            </button>
          )}

          {mode === "word-to-pdf" && (
            <button onClick={handleWordToPdf}>
              Convert Word → PDF
            </button>
          )}
        </>
      )}

      {loading && <ProgressBar progress={progress} />}
    </div>
  )
}

export default App
