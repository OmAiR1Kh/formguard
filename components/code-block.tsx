"use client"

import { CopyButton } from "./copy-button"

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = "html" }: CodeBlockProps) {
  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 z-10">
        <CopyButton text={code} />
      </div>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm font-mono">{code}</code>
      </pre>
    </div>
  )
}
