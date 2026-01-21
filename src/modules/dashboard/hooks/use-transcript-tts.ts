import { useCallback, useEffect, useRef, useState } from "react"

type Rate = 1 | 1.5 | 2

export function useTranscriptTts({ text, itemId }: { text: string; itemId: string }) {
  const [ttsSupported, setTtsSupported] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasUtterance, setHasUtterance] = useState(false)
  const [rate, setRate] = useState<Rate>(1)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window)
  }, [])

  // Reset TTS when switching items
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    utteranceRef.current = null
    setIsPlaying(false)
    setHasUtterance(false)
  }, [itemId])

  const stopTts = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    utteranceRef.current = null
    setIsPlaying(false)
    setHasUtterance(false)
  }, [])

  const startTts = useCallback(() => {
    if (!(typeof window !== "undefined" && "speechSynthesis" in window)) return

    // Restart cleanly each time to keep the UI simple/predictable.
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = rate
    u.onend = () => {
      utteranceRef.current = null
      setIsPlaying(false)
      setHasUtterance(false)
    }
    u.onerror = () => {
      utteranceRef.current = null
      setIsPlaying(false)
      setHasUtterance(false)
    }
    utteranceRef.current = u
    window.speechSynthesis.speak(u)
    setIsPlaying(true)
    setHasUtterance(true)
  }, [rate, text])

  const pauseTts = useCallback(() => {
    if (!(typeof window !== "undefined" && "speechSynthesis" in window)) return
    window.speechSynthesis.pause()
    setIsPlaying(false)
    setHasUtterance(true)
  }, [])

  const resumeTts = useCallback(() => {
    if (!(typeof window !== "undefined" && "speechSynthesis" in window)) return
    window.speechSynthesis.resume()
    setIsPlaying(true)
    setHasUtterance(true)
  }, [])

  const toggleTts = useCallback(() => {
    if (!ttsSupported) return
    // If we have an utterance that was paused, resume. Otherwise (re)start from beginning.
    if (utteranceRef.current && typeof window !== "undefined" && window.speechSynthesis.paused) {
      resumeTts()
      return
    }
    if (isPlaying) {
      pauseTts()
      return
    }
    startTts()
  }, [isPlaying, pauseTts, resumeTts, startTts, ttsSupported])

  useEffect(() => {
    // If rate changes mid-play, restart to apply it (simple behavior).
    if (!ttsSupported) return
    if (!utteranceRef.current) return
    if (isPlaying) {
      startTts()
    }
  }, [isPlaying, rate, startTts, ttsSupported])

  return {
    ttsSupported,
    isPlaying,
    hasUtterance,
    rate,
    setRate,
    toggleTts,
    stopTts,
  }
}


