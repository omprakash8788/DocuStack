import axios from "axios"

export const convertImagesToPdf = (
  form: FormData,
  quality: number,
  setProgress: (n: number) => void
) => {
  return axios.post(
    `http://localhost:5000/convert/imgs-to-pdf?quality=${quality}`,
    form,
    {
      responseType: "blob",
      onUploadProgress: (e) => {
        if (e.total) {
          setProgress(Math.round((e.loaded * 100) / e.total))
        }
      }
    }
  )
}

export const pdfToWord = (
  form: FormData,
  setProgress: (n: number) => void
) => {
  return axios.post(
    "http://localhost:5000/convert/pdf-to-word",
    form,
    {
      responseType: "blob",
      onUploadProgress: (e) => {
        if (e.total) {
          setProgress(Math.round((e.loaded * 100) / e.total))
        }
      }
    }
  )
}

export const wordToPdf = (
  form: FormData,
  setProgress: (n: number) => void
) => {
  return axios.post(
    "http://localhost:5000/convert/word-to-pdf",
    form,
    {
      responseType: "blob",
      onUploadProgress: (e) => {
        if (e.total) {
          setProgress(Math.round((e.loaded * 100) / e.total))
        }
      }
    }
  )
}
