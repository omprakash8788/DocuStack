import React, { useState, useRef } from "react"
import axios from "axios"
import "./App.css"

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [quality, setQuality] = useState<number>(85)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const onFilesSelected = (fileList: FileList) => {
    const arr = Array.from(fileList).filter(file =>
      file.type.startsWith("image/")
    )

    setFiles(prev => [...prev, ...arr])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    onFilesSelected(e.target.files)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    onFilesSelected(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleConvert = async () => {
    if (!files.length) {
      alert("Add at least one image")
      return
    }

    const form = new FormData()
    files.forEach(file => form.append("files", file))

    try {
      setLoading(true)

      const res = await axios.post(
        `http://localhost:5000/convert/imgs-to-pdf?quality=${quality}`,
        form,
        { responseType: "blob" }
      )

      const blob = new Blob([res.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "combined.pdf"
      a.click()

    } catch (error) {
      console.error(error)
      alert("Conversion failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>File Converter — Images → Single PDF</h1>

      <div
        className={`dropzone ${dragOver ? "over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleInputChange}
        />
        <p>Drag & Drop images here, or click to select</p>
      </div>

      {files.length > 0 && (
        <div className="files">
          <h3>Selected images ({files.length})</h3>
          <div className="thumbs">
            {files.map((file, index) => (
              <div key={index} className="thumb">
                <img src={URL.createObjectURL(file)} alt={file.name} />
                <div className="meta">
                  <small>{file.name}</small>
                  <button onClick={() => removeFile(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="controls">
        <label>Compression quality: {quality}</label>
        <input
          type="range"
          min="10"
          max="100"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
        />
      </div>

      <button
        className="convert-btn"
        onClick={handleConvert}
        disabled={loading}
      >
        {loading ? "Converting..." : "Convert to single PDF"}
      </button>
    </div>
  )
}

export default App

