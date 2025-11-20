import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/convert/img-to-pdf",
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      a.click();

      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Conversion failed");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>File Converter App</h2>
      <p>Image → PDF</p>

      <input type="file" onChange={handleFileChange} />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Converting..." : "Convert to PDF"}
      </button>
    </div>
  );
}

export default App;
