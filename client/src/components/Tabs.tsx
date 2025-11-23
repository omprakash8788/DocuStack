interface TabsProps {
  mode: string
  setMode: (v: string) => void
}

const Tabs = ({ mode, setMode }: TabsProps) => {
  return (
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
  )
}

export default Tabs
