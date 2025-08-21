"use client"

import React, { useRef, useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, Heading1, Heading2, Heading3, ImageIcon, Quote } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const { toast } = useToast()

  // Initialize editor content
  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      editorRef.current?.focus()
      handleInput()
    },
    [handleInput],
  )

  const insertHeading = useCallback(
    (level: number) => {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const headingElement = document.createElement(`h${level}`)
        headingElement.style.fontWeight = "bold"
        headingElement.style.fontSize = level === 1 ? "1.5em" : level === 2 ? "1.3em" : "1.1em"
        headingElement.style.margin = "0.5em 0"

        try {
          range.deleteContents()
          range.insertNode(headingElement)

          // Place cursor inside the heading
          const newRange = document.createRange()
          newRange.setStart(headingElement, 0)
          newRange.setEnd(headingElement, 0)
          selection.removeAllRanges()
          selection.addRange(newRange)

          editorRef.current?.focus()
          handleInput()
        } catch (error) {
          console.error("Error inserting heading:", error)
        }
      }
    },
    [handleInput],
  )

  const insertList = useCallback(() => {
    execCommand("insertUnorderedList")
  }, [execCommand])

  const insertBlockquote = useCallback(() => {
    execCommand("formatBlock", "blockquote")
  }, [execCommand])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      })
      return
    }

    try {
      setImageUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      if (data.success && (data.url || data.data?.url)) {
        const imageUrl = data.url || data.data?.url

        // Insert image at cursor position
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const imgElement = document.createElement("img")
          imgElement.src = imageUrl
          imgElement.style.maxWidth = "100%"
          imgElement.style.height = "auto"
          imgElement.style.margin = "10px 0"
          imgElement.alt = "Uploaded image"

          range.deleteContents()
          range.insertNode(imgElement)

          // Move cursor after image
          const newRange = document.createRange()
          newRange.setStartAfter(imgElement)
          newRange.setEndAfter(imgElement)
          selection.removeAllRanges()
          selection.addRange(newRange)
        }

        editorRef.current?.focus()
        handleInput()

        toast({
          title: "Success",
          description: "Image uploaded and inserted successfully",
        })
      } else {
        throw new Error(data.error || "Upload failed - no URL returned")
      }
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: `Failed to upload image: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setImageUploading(false)
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <Button type="button" variant="ghost" size="sm" onClick={() => execCommand("bold")} className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm" onClick={() => execCommand("italic")} className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button type="button" variant="ghost" size="sm" onClick={() => insertHeading(1)} className="h-8 w-8 p-0">
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm" onClick={() => insertHeading(2)} className="h-8 w-8 p-0">
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm" onClick={() => insertHeading(3)} className="h-8 w-8 p-0">
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button type="button" variant="ghost" size="sm" onClick={insertList} className="h-8 w-8 p-0">
          <List className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm" onClick={insertBlockquote} className="h-8 w-8 p-0">
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={fileInputRef} />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={imageUploading}
          className="h-8 w-8 p-0"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={`min-h-[400px] p-4 focus:outline-none ${className}`}
        style={{
          whiteSpace: "pre-wrap",
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.3em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.1em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        
        [contenteditable] ul {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }
        
        [contenteditable] li {
          margin: 0.25em 0;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 0.5em 0;
          font-style: italic;
          color: #6b7280;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          margin: 10px 0;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}
