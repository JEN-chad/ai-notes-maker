"use client";

import React, { useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
} from "lucide-react";

export const EditorExtension = ({ editor }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const handler = () => setTick((t) => t + 1);

    editor.on("update", handler);
    editor.on("selectionUpdate", handler);
    editor.on("transaction", handler);

    return () => {
      editor.off("update", handler);
      editor.off("selectionUpdate", handler);
      editor.off("transaction", handler);
    };
  }, [editor]);

  if (!editor) return null;

  const btn = (active) =>
    `px-3 py-1 rounded transition flex items-center justify-center ${
      active ? "text-blue-500 bg-gray-200" : "text-black"
    } hover:bg-gray-100`;

  return (
    <div className="control-group mb-2 p-2 border-b flex gap-1 flex-wrap">
      {/* Headers */}
      {/* H1 */}
      <button
        onClick={() => editor.chain().focus().toggleFontSize("2rem").run()}
        className={btn(editor.isActive("fontSize", { size: "2rem" }))}
        title="Heading 1"
      >
        H1
      </button>

      {/* H2 */}
      <button
        onClick={() => editor.chain().focus().toggleFontSize("1.5rem").run()}
        className={btn(editor.isActive("fontSize", { size: "1.5rem" }))}
        title="Heading 2"
      >
        H2
      </button>

      {/* H3 */}
      <button
        onClick={() => editor.chain().focus().toggleFontSize("1.25rem").run()}
        className={btn(editor.isActive("fontSize", { size: "1.25rem" }))}
        title="Heading 3"
      >
        H3
      </button>

      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive("bold"))}
        title="Bold (Ctrl+B)"
      >
        <Bold size={18} />
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive("italic"))}
        title="Italic (Ctrl+I)"
      >
        <Italic size={18} />
      </button>

      {/* Underline */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btn(editor.isActive("underline"))}
        title="Underline (Ctrl+U)"
      >
        <Underline size={18} />
      </button>

      {/* Highlight */}
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={btn(editor.isActive("highlight"))}
        title="Highlight"
      >
        <Highlighter size={18} />
      </button>

      {/* Bullet List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        <List size={18} />
      </button>

      {/* Text Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={btn(editor.isActive({ textAlign: "left" }))}
        title="Align Left"
      >
        <AlignLeft size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={btn(editor.isActive({ textAlign: "center" }))}
        title="Align Center"
      >
        <AlignCenter size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={btn(editor.isActive({ textAlign: "right" }))}
        title="Align Right"
      >
        <AlignRight size={18} />
      </button>
    </div>
  );
};
