"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";

type Props = {
  value: string;
  onChange: (html: string) => void;
  className?: string;
};

export default function RichTextEditor({ value, onChange, className }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      BulletList,
      OrderedList,
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] max-h-[55vh] overflow-auto p-3 outline-none rounded-b-md bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
      },
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== (value || "")) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className={cn("rounded-md border border-border", className)}>
      <div className="flex flex-wrap gap-2 p-2 bg-muted border-b border-border rounded-t-md">
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <span className="italic">I</span>
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">S</span>
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleCode().run()}>
          {'</>'}
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().setParagraph().run()}>
          P
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          “Quote”
        </Button>
        <Button
          size="sm"
          variant="outline"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const prev = editor.getAttributes('link').href as string | undefined
            const url = window.prompt('Nhập URL', prev || 'https://')
            if (url === null) return
            if (url === '') return editor.chain().focus().unsetLink().run()
            try {
              new URL(url)
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            } catch (_) {
              // ignore invalid URL
            }
          }}
        >
          Link
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().unsetLink().run()}>
          Unlink
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </Button>
        <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          Clear
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className={cn(
          "min-h-[200px] max-h-[55vh] overflow-auto p-3 outline-none rounded-b-md transition-colors",
          editor.isFocused ? "bg-accent/10" : "bg-background"
        )}
      />
    </div>
  );
}


