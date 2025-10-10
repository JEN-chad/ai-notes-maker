"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorExtension } from "./EditorExtension";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
// import Heading from "@tiptap/extension-heading"; // ✅ add this
import FontSize from "./FontSize";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export const TextEditor = ({ fileId }) => {
  const notes = useQuery(api.notes.GetNotes, {
    fileId: fileId,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // disable StarterKit’s built-in heading so we can use custom one
      }),
      //   Heading.configure({
      //     levels: [1, 2, 3], // ✅ enable H1, H2, H3 properly
      //   }),
      Underline,
      FontSize,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start taking your notes…",
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none p-5 focus:cursor-text h-full w-full prose max-w-none",
      },
    },
  });

  useEffect(() => {
    editor && editor.commands.setContent(notes);
  }, [notes && editor]);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg shadow-lg flex flex-col h-screen border-r">
      {/* Toolbar (fixed at top) */}
      <div className="sticky top-0 bg-white border-t border-b z-10">
        <EditorExtension editor={editor} fileId={fileId} />
      </div>

      {/* Editor Content */}
      {/* <div className="flex-1 overflow-scroll">
        {editor && (
          <EditorContent
            editor={editor}
            className="prose max-w-none w-full text-base sm:text-lg md:text-[1rem] leading-relaxed p-2 sm:p-3 overflow-x-hidden"
          />
        )}
      </div> */}
      <div className="w-full max-w-full overflow-x-hidden text-wrap">
        {editor && (
          <EditorContent
            editor={editor}
            className="ProseMirror w-full max-w-full overflow-x-hidden"
          />
        )}
      </div>
    </div>
  );
};
