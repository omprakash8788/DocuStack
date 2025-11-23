import { useState } from "react"

export const useUploader = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  return {
    loading,
    progress,
    setLoading,
    setProgress,
  }
}
