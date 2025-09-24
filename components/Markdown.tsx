'use client'
import { useEffect, useState } from 'react'

export default function Markdown({ src }: { src: string }) {
  const [html, setHtml] = useState('Loading...')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(src)
        const text = await res.text()
        let h = text
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
          .replace(/\*(.*)\*/gim, '<em>$1</em>')
          .replace(/`([^`]+)`/gim, '<code>$1</code>')
          .replace(/^- (.*$)/gim, '<li>$1</li>')
          .replace(/\n\n/g, '<br/><br/>')
        setHtml(h)
      } catch (e) {
        setHtml('Failed to load documentation.')
      }
    }
    load()
  }, [src])

  return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
}