import { useEffect, useRef, useState } from 'react'
import { Check, Clipboard } from 'lucide-react'

export function CopyCommand({ code, label = 'command' }) {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  async function copy() {
    let success = false

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code)
        success = true
      }
    } catch {
      success = false
    }

    if (!success) {
      try {
        copyWithFallback(code)
        success = true
      } catch {
        success = false
      }
    }

    setCopied(success)
    window.clearTimeout(resetTimer.current)
    if (success) resetTimer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      className="copy-command"
      onClick={copy}
      aria-label={copied ? `Copied ${label}` : `Copy ${label}`}
    >
      {copied ? <Check size={15} /> : <Clipboard size={15} />}
      <span>{copied ? 'COPIED' : 'COPY'}</span>
    </button>
  )
}

function copyWithFallback(value) {
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.setAttribute('aria-hidden', 'true')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  try {
    if (!document.execCommand('copy')) throw new Error('Clipboard copy failed')
  } finally {
    textarea.remove()
  }
}
