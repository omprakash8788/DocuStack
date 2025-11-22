// import React, { useState, useRef } from "react";
// import axios from "axios";
// import "./App.css";

// const App: React.FC = () => {
//   const [files, setFiles] = useState<File[]>([]);
//   const [dragOver, setDragOver] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [quality, setQuality] = useState<number>(85);
//   const [singleFile, setSingleFile] = useState<File | null>(null);
//   const [mode, setMode] = useState("img-to-pdf")

//   const fileInputRef = useRef<HTMLInputElement | null>(null);


//   const handlePdfToWord = async () => {
//   if (!singleFile || singleFile.type !== "application/pdf") {
//     alert("Please upload a PDF file")
//     return
//   }

//   const form = new FormData()
//   form.append("file", singleFile)

//   try {
//     const res = await axios.post(
//       "http://localhost:5000/convert/pdf-to-word",
//       form,
//       { responseType: "blob" }
//     )

//     const blob = new Blob([res.data])
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = "converted.docx"
//     a.click()

//   } catch (err) {
//     console.error(err)
//     alert("PDF to Word failed")
//   }
// }

// const handleWordToPdf = async () => {
//   if (!singleFile || !singleFile.name.endsWith(".docx")) {
//     alert("Please upload a DOCX file")
//     return
//   }

//   const form = new FormData()
//   form.append("file", singleFile)

//   try {
//     const res = await axios.post(
//       "http://localhost:5000/convert/word-to-pdf",
//       form,
//       { responseType: "blob" }
//     )

//     const blob = new Blob([res.data])
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = "converted.pdf"
//     a.click()

//   } catch (err) {
//     console.error(err)
//     alert("Word to PDF failed")
//   }
// }



//   const onFilesSelected = (fileList: FileList) => {
//     const arr = Array.from(fileList).filter((file) =>
//       file.type.startsWith("image/")
//     );

//     setFiles((prev) => [...prev, ...arr]);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     onFilesSelected(e.target.files);
//   };

  

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragOver(false);
//     onFilesSelected(e.dataTransfer.files);
//   };

//   const removeFile = (index: number) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleConvert = async () => {
//     if (!files.length) {
//       alert("Add at least one image");
//       return;
//     }

//     const form = new FormData();
//     files.forEach((file) => form.append("files", file));

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         `http://localhost:5000/convert/imgs-to-pdf?quality=${quality}`,
//         form,
//         { responseType: "blob" }
//       );

//       const blob = new Blob([res.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "combined.pdf";
//       a.click();
//     } catch (error) {
//       console.error(error);
//       alert("Conversion failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app">
//       <h1>File Converter — Images → Single PDF</h1>

//       <input
//         type="file"
//         accept=".pdf,.docx"
//         onChange={(e) => e.target.files && setSingleFile(e.target.files[0])}
//       />

//       <div
//         className={`dropzone ${dragOver ? "over" : ""}`}
//         onDragOver={(e) => {
//           e.preventDefault();
//           setDragOver(true);
//         }}
//         onDragLeave={() => setDragOver(false)}
//         onDrop={handleDrop}
//         onClick={() => fileInputRef.current?.click()}
//       >
//         <input
//           ref={fileInputRef}
//           type="file"
//           multiple
//           accept="image/*"
//           style={{ display: "none" }}
//           onChange={handleInputChange}
//         />
//         <p>Drag & Drop images here, or click to select</p>
//       </div>

//       {files.length > 0 && (
//         <div className="files">
//           <h3>Selected images ({files.length})</h3>
//           <div className="thumbs">
//             {files.map((file, index) => (
//               <div key={index} className="thumb">
//                 <img src={URL.createObjectURL(file)} alt={file.name} />
//                 <div className="meta">
//                   <small>{file.name}</small>
//                   <button onClick={() => removeFile(index)}>Remove</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="controls">
//         <label>Compression quality: {quality}</label>
//         <input
//           type="range"
//           min="10"
//           max="100"
//           value={quality}
//           onChange={(e) => setQuality(Number(e.target.value))}
//         />
//       </div>

//       <button
//         className="convert-btn"
//         onClick={handleConvert}
//         disabled={loading}
//       >
//         {loading ? "Converting..." : "Convert to single PDF"}
//       </button>

//       <button onClick={handlePdfToWord}>PDF → WORD</button>
// <button onClick={handleWordToPdf}>WORD → PDF</button>

//     </div>
//   );
// };

// export default App;

import React, { useState, useRef } from "react"
import axios from "axios"
import "./App.css"

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [quality, setQuality] = useState(85)
  const [singleFile, setSingleFile] = useState<File | null>(null)

  const [mode, setMode] = useState("img-to-pdf")

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const onFilesSelected = (fileList: FileList) => {
    const arr = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/")
    )

    setFiles((prev) => [...prev, ...arr])
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
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  /* ------------ IMAGE → PDF ------------ */
  const handleConvert = async () => {
    if (!files.length) {
      alert("Add at least one image")
      return
    }

    const form = new FormData()
    files.forEach((file) => form.append("files", file))

    try {
      setLoading(true)
      setProgress(0)

      const res = await axios.post(
        `http://localhost:5000/convert/imgs-to-pdf?quality=${quality}`,
        form,
        {
          responseType: "blob",
          onUploadProgress: (e) => {
            if (e.total) {
              setProgress(Math.round((e.loaded * 100) / e.total))
            }
          },
        }
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

  /* ------------ PDF → WORD ------------ */
  const handlePdfToWord = async () => {
    if (!singleFile || singleFile.type !== "application/pdf") {
      alert("Upload a valid PDF")
      return
    }

    const form = new FormData()
    form.append("file", singleFile)

    try {
      setLoading(true)
      setProgress(0)

      const res = await axios.post(
        "http://localhost:5000/convert/pdf-to-word",
        form,
        {
          responseType: "blob",
          onUploadProgress: (e) => {
            if (e.total) {
              setProgress(Math.round((e.loaded * 100) / e.total))
            }
          },
        }
      )

      const blob = new Blob([res.data])
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "converted.docx"
      a.click()
    } catch (err) {
      console.error(err)
      alert("PDF to Word failed")
    } finally {
      setLoading(false)
    }
  }

  /* ------------ WORD → PDF ------------ */
  const handleWordToPdf = async () => {
    if (!singleFile || !singleFile.name.endsWith(".docx")) {
      alert("Upload a DOCX file")
      return
    }

    const form = new FormData()
    form.append("file", singleFile)

    try {
      setLoading(true)
      setProgress(0)

      const res = await axios.post(
        "http://localhost:5000/convert/word-to-pdf",
        form,
        {
          responseType: "blob",
          onUploadProgress: (e) => {
            if (e.total) {
              setProgress(Math.round((e.loaded * 100) / e.total))
            }
          },
        }
      )

      const blob = new Blob([res.data])
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "converted.pdf"
      a.click()
    } catch (err) {
      console.error(err)
      alert("Word to PDF failed")
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

      {/* -------- TABS -------- */}
      <div className="tabs">
        <button
          className={mode === "img-to-pdf" ? "active" : ""}
          onClick={() => setMode("img-to-pdf")}
        >
          Image → PDF
        </button>
        <button
          className={mode === "pdf-to-word" ? "active" : ""}
          onClick={() => setMode("pdf-to-word")}
        >
          PDF → Word
        </button>
        <button
          className={mode === "word-to-pdf" ? "active" : ""}
          onClick={() => setMode("word-to-pdf")}
        >
          Word → PDF
        </button>
      </div>

      {/* ---------------- IMAGE TO PDF ---------------- */}
      {mode === "img-to-pdf" && (
        <>
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
            <p>Drag & drop images or click to select</p>
          </div>

          {files.length > 0 && (
            <div className="files">
              <h3>Selected Images ({files.length})</h3>
              <div className="thumbs">
                {files.map((file, index) => (
                  <div key={index} className="thumb">
                    <img src={URL.createObjectURL(file)} alt={file.name} />
                    <div className="meta">
                      <small>{file.name}</small>
                      <button onClick={() => removeFile(index)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="controls">
            <label>Quality: {quality}</label>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
            />
          </div>

          <button className="convert-btn" onClick={handleConvert} disabled={loading}>
            {loading ? "Converting..." : "Convert to PDF"}
          </button>
        </>
      )}

      {/* ---------------- SINGLE FILE MODES ---------------- */}
      {(mode === "pdf-to-word" || mode === "word-to-pdf") && (
        <div className="single-file">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) =>
              e.target.files && setSingleFile(e.target.files[0])
            }
          />

          {singleFile && (
            <div className="file-card">
              <span className="file-icon">
                {getFileIcon(singleFile)}
              </span>
              <span>{singleFile.name}</span>
            </div>
          )}

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
        </div>
      )}

      {/* -------- PROGRESS BAR -------- */}
      {loading && (
        <div className="progress-box">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <small>{progress}%</small>
        </div>
      )}
    </div>
  )
}

export default App

