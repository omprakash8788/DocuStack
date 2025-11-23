import { RefObject } from "react"

interface DropzoneProps {
  dragOver: boolean
  setDragOver: (v: boolean) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputRef: RefObject<HTMLInputElement>
}

const Dropzone = ({
  dragOver,
  setDragOver,
  onDrop,
  onChange,
  inputRef,
}: DropzoneProps) => {
  return (
    <div
      className={`dropzone ${dragOver ? "over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={onChange}
      />

      <p>Drag & drop images or click to select</p>
    </div>
  )
}

export default Dropzone
