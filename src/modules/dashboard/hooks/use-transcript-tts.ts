import { useCallback, useEffect, useRef, useState } from "react"

type Rate = 1 | 1.5 | 2

export function useTranscriptTts({ text, itemId }: { text: string; itemId: string }) {
  const [ttsSupported, setTtsSupported] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasUtterance, setHasUtterance] = useState(false)
  const [rate, setRate] = useState<Rate>(1)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window)
    return () => {
      isMountedRef.current = false
    }
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

    const synth = window.speechSynthesis

    // Cancel any ongoing speech first
    synth.cancel()
    
    // Chrome bug workaround: need to resume if paused
    if (synth.paused) {
      synth.resume()
    }

    const u = new SpeechSynthesisUtterance(text)
    u.rate = rate

    u.onstart = () => {
      if (isMountedRef.current) {
        setIsPlaying(true)
        setHasUtterance(true)
      }
    }

    u.onend = () => {
      if (isMountedRef.current) {
        utteranceRef.current = null
        setIsPlaying(false)
        setHasUtterance(false)
      }
    }

    u.onerror = (e) => {
      // Ignore 'interrupted' errors which happen on cancel
      if (e.error === 'interrupted') return
      if (isMountedRef.current) {
        utteranceRef.current = null
        setIsPlaying(false)
        setHasUtterance(false)
      }
    }

    utteranceRef.current = u
    
    // Set state immediately for responsive UI
    setIsPlaying(true)
    setHasUtterance(true)
    
    synth.speak(u)
  }, [rate, text])

  const pauseTts = useCallback(() => {
    if (!(typeof window !== "undefined" && "speechSynthesis" in window)) return
    window.speechSynthesis.pause()
    setIsPlaying(false)
  }, [])

  const resumeTts = useCallback(() => {
    if (!(typeof window !== "undefined" && "speechSynthesis" in window)) return
    window.speechSynthesis.resume()
    setIsPlaying(true)
  }, [])

  const toggleTts = useCallback(() => {
    if (!ttsSupported) return
    
    const synth = window.speechSynthesis
    
    // If currently playing, pause it
    if (isPlaying) {
      pauseTts()
      return
    }
    
    // If we have a paused utterance, resume it
    if (hasUtterance && synth.paused) {
      resumeTts()
      return
    }
    
    // Otherwise start fresh
    startTts()
  }, [isPlaying, hasUtterance, pauseTts, resumeTts, startTts, ttsSupported])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    // If rate changes mid-play, restart to apply it
    if (!ttsSupported) return
    if (!utteranceRef.current) return
    if (isPlaying) {
      startTts()
    }
  }, [rate]) // eslint-disable-line react-hooks/exhaustive-deps

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

