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
import { useLocale } from "@/hooks/useLocale";

type Props = {
  value: string;
  onChange: (html: string) => void;
  className?: string;
};

export default function RichTextEditor({ value, onChange, className }: Props) {
  const { t } = useLocale();
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
        <Button size="sm" variant="outline" title={t("editor.bold")} aria-label={t("editor.bold")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBold().run()}>
          {t("editor.bold")}
        </Button>
        <Button size="sm" variant="outline" title={t("editor.italic")} aria-label={t("editor.italic")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <span className="italic">{t("editor.italic")}</span>
        </Button>
        <Button size="sm" variant="outline" title={t("editor.underline")} aria-label={t("editor.underline")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">{t("editor.underline")}</span>
        </Button>
        <Button size="sm" variant="outline" title={t("editor.strike")} aria-label={t("editor.strike")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">{t("editor.strike")}</span>
        </Button>
        <Button size="sm" variant="outline" title={t("editor.code")} aria-label={t("editor.code")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleCode().run()}>
          {t("editor.code")}
        </Button>
        <Button size="sm" variant="outline" title={t("editor.bulletList")} aria-label={t("editor.bulletList")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          {t("editor.bulletList")}
        </Button>
        <Button size="sm" variant="outline" title={t("editor.orderedList")} aria-label={t("editor.orderedList")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          {t("editor.orderedList")}
        </Button>
        <Button size="sm" variant="outline" title={t("editor.h3")} aria-label={t("editor.h3")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          {t("editor.h3")}
        </Button>
        <Button size="sm" variant="outline" title={t("editor.h2")} aria-label={t("editor.h2")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          {t("editor.h2")}
        </Button>
        <Button size="sm" variant="outline" title={t("editor.h1")} aria-label={t("editor.h1")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          {t("editor.h1")}
        </Button>
        <Button size="sm" variant="outline" title={t("editor.paragraph")} aria-label={t("editor.paragraph")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().setParagraph().run()}>
          {t("editor.paragraph")}
        </Button>
        <Button size="sm" variant="outline" title={t("editor.blockquote")} aria-label={t("editor.blockquote")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          {t("editor.blockquote")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          title={t("editor.link")}
          aria-label={t("editor.link")}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const prev = editor.getAttributes('link').href as string | undefined
            const url = window.prompt(t('editor.enterUrl'), prev || 'https://')
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
          {t("editor.link")}
        </Button>
        <Button size="sm" variant="outline" title={t("editor.unlink")} aria-label={t("editor.unlink")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().unsetLink().run()}>
          {t("editor.unlink")}
        </Button>
        <Button size="sm" variant="outline" title={t("editor.undo")} aria-label={t("editor.undo")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().undo().run()}>
          {t("editor.undo")}
        </Button>
        <Button size="sm" variant="outline" title={t("editor.redo")} aria-label={t("editor.redo")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().redo().run()}>
          {t("editor.redo")}
        </Button>
        <Button size="sm" variant="outline" title={t("editor.clear")} aria-label={t("editor.clear")} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          {t("editor.clear")}
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


