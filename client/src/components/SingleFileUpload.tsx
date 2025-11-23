import "../App.css"

interface Props {
  singleFile: File | null
  setSingleFile: (file: File) => void
  getFileIcon: (file: File) => string
}

const SingleFileUpload = ({
  singleFile,
  setSingleFile,
  getFileIcon,
}: Props) => {
  return (
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
    </div>
  )
}

export default SingleFileUpload
