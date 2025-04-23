"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeBlockProps {
  language: string
  value: string
}

export default function MarkdownCodeBlock({ language, value }: CodeBlockProps) {
  return (
    <div className="rounded-md overflow-hidden my-4">
      <div className="px-4 py-2 bg-slate-800/80 text-xs font-mono text-slate-400 border-b border-slate-700/30">
        {language.toUpperCase()}
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.375rem 0.375rem',
          
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}