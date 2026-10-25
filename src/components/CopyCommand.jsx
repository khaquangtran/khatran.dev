import { useState } from 'react'
import { Check, Clipboard } from 'lucide-react'

export function CopyCommand({ code }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button
      className="copy-command"
      onClick={copy}
      aria-label={copied ? 'Copied command' : 'Copy command'}
    >
      {copied ? <Check size={15} /> : <Clipboard size={15} />}
      <span>{copied ? 'COPIED' : 'COPY'}</span>
    </button>
  )
}
