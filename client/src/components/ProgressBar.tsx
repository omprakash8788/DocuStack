const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="progress-box">
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <small>{progress}%</small>
  </div>
)

export default ProgressBar
