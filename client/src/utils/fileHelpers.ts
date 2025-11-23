export const isImage = (file: File) =>
  file.type.startsWith("image/")

export const isPDF = (file: File) =>
  file.type === "application/pdf"

export const isDOCX = (file: File) =>
  file.name.endsWith(".docx")

export const downloadBlob = (
  data: Blob,
  filename: string
) => {
  const blob = new Blob([data])
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
}
