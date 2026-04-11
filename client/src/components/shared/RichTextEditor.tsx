"use client";
// Rich text editor used for question content and inline rich text fields.
// Included in the assessment client for better exam authoring.

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  List,
  ListOrdered,
  ChevronDown,
} from "lucide-react";
import { useEffect } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

// Provides a lightweight rich text input surface for question content.
export const RichTextEditor = ({
content,
  onChange,
  placeholder = "Type here...",
  minHeight = "80px",
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keeps the editor document synchronized when parent content changes.
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-[8px] border border-[#e7edf5] bg-white transition-all focus-within:border-primary focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-[#edf1f7] bg-[#fbfcfe] px-2 py-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="rounded-[4px] p-1 text-[#64748b] transition-colors hover:bg-[#f1f5f9]"
          title="Undo"
        >
          <Undo2 className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="rounded-[4px] p-1 text-[#64748b] transition-colors hover:bg-[#f1f5f9]"
          title="Redo"
        >
          <Redo2 className="h-3 w-3" />
        </button>

        <div className="mx-1 h-4 w-px bg-[#e2e8f0]" />

        <button
          type="button"
          className="flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[10px] text-[#64748b] transition-colors hover:bg-[#f1f5f9]"
        >
          Normal text <ChevronDown className="h-2.5 w-2.5" />
        </button>

        <div className="mx-1 h-4 w-px bg-[#e2e8f0]" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-[4px] border p-1 transition-colors ${editor.isActive("bulletList") ? "border-[#f97316] bg-white text-[#0f172a]" : "border-transparent text-[#64748b] hover:bg-[#f1f5f9]"}`}
          title="Bullet List"
        >
          <List className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded-[4px] border p-1 transition-colors ${editor.isActive("orderedList") ? "border-[#f97316] bg-white text-[#0f172a]" : "border-transparent text-[#64748b] hover:bg-[#f1f5f9]"}`}
          title="Ordered List"
        >
          <ListOrdered className="h-3 w-3" />
        </button>

        <div className="mx-1 h-4 w-px bg-[#e2e8f0]" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-[4px] border p-1 transition-colors ${editor.isActive("bold") ? "border-[#f97316] bg-white text-[#0f172a]" : "border-transparent text-[#64748b] hover:bg-[#f1f5f9]"}`}
          title="Bold"
        >
          <Bold className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-[4px] border p-1 transition-colors ${editor.isActive("italic") ? "border-[#f97316] bg-white text-[#0f172a]" : "border-transparent text-[#64748b] hover:bg-[#f1f5f9]"}`}
          title="Italic"
        >
          <Italic className="h-3 w-3" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-3 py-2 [&_.ProseMirror]:min-h-[inherit] [&_.ProseMirror]:bg-white [&_.ProseMirror]:outline-none [&_.ProseMirror]:text-[12px] [&_.ProseMirror]:leading-5 [&_.ProseMirror]:text-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[#c0c7d4]"
        style={{ minHeight }}
      />
    </div>
  );
}


