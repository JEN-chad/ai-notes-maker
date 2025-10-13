"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorExtension } from "./EditorExtension";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import FontSize from "./FontSize";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

// 🧩 Import TipTap table extensions
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

export const TextEditor = ({ fileId }) => {
  const notes = useQuery(api.notes.GetNotes, { fileId });
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),

      // 🧩 Add table support
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,

      Underline,
      FontSize,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start taking your notes…" }),
    ],
    immediatelyRender: false,
    content: "",
    editable: !isMobile, // 🔒 Lock typing on mobile only
    editorProps: {
      attributes: {
        class:
          "focus:outline-none p-5 text-base sm:text-lg md:text-[1rem] leading-relaxed w-full prose max-w-none text-gray-800 dark:text-gray-100",
      },
    },
  });

  // ✅ Load notes
  useEffect(() => {
    if (editor && notes) {
      editor.commands.setContent(notes);
    }
  }, [notes, editor]);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg shadow-lg flex flex-col h-screen border-r">
      {/* Toolbar — hidden on mobile */}
      {!isMobile && (
        <div className="sticky top-0 bg-white border-t border-b z-10">
          <EditorExtension editor={editor} fileId={fileId} />
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto w-full max-w-full text-wrap transition-all">
        {editor && (
          <EditorContent
            editor={editor}
            className={`ProseMirror w-full max-w-full overflow-x-hidden ${
              isMobile ? "opacity-90 cursor-not-allowed select-none" : ""
            }`}
          />
        )}
      </div>

      {/* Mobile notice */}
      {isMobile && (
        <p className="text-center text-gray-500 text-sm py-3 italic">
          ✨ View-only mode on mobile
        </p>
      )}
    </div>
  );
};
