import "../App.css"
import { MdDeleteForever } from "react-icons/md";
interface Props {
  files: File[]
  removeFile: (i: number) => void
}

const ImageList = ({ files, removeFile }: Props) => {
  if (!files.length) return null

  return (
    <div className="files">
      <h3>Selected Images ({files.length})</h3>

      <div className="thumbs">
        {files.map((file, index) => (
          <div key={index} className="thumb">
            <img src={URL.createObjectURL(file)} alt={file.name}/>
            <div className="meta">
              <small>{file.name}</small>
              {/* <button className="rbtn" > */}
                <MdDeleteForever className="rbtn" onClick={() => removeFile(index)}/>
              {/* </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageList
