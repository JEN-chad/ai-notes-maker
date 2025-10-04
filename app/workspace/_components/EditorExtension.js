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
  Sparkles,
} from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { chatSession } from "@/configs/AiModel";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export const EditorExtension = ({ editor, fileId }) => {
  const [, setTick] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const { user } = useUser();

  const searchAI = useAction(api.myAction.search);
  const saveNotes = useMutation(api.notes.AddNotes);

  // const onAiClick = async () => {
  //   const selectedText = editor.state.doc.textBetween(
  //     editor.state.selection.from,
  //     editor.state.selection.to,
  //     " "
  //   );
  //   console.log("Selected text:", selectedText);
  //   const result = await searchAI({
  //     query: selectedText,
  //     fileId: id,
  //   });
  //   const UnformattedAns = JSON.parse(result);
  //   let allUnformattedAnswer = "";
  //   UnformattedAns &&
  //     UnformattedAns.forEach((item) => {
  //       allUnformattedAnswer = allUnformattedAnswer + item.pageContent;
  //     });

  //     const PROMPT="For question: "+selectedText+" and with the given content as answer,"+
  //     "please give appropriate answer in HTML format. The answer content is: "+allUnformattedAnswer

  //     const AiModelResult = await chatSession.sendMessage(PROMPT);
  //     console.log(AiModelResult.response.text())
  //   };

  const onAiClick = async () => {
    try {
      toast("Wait answer getting generated", { position: "top-center" });
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        " "
      );
      setIsLoading(true);
      console.log("Selected text:", selectedText);

      // Convex already returns an array of objects
      const UnformattedAns = await searchAI({
        query: selectedText,
        fileId: id,
      });

      let allUnformattedAnswer = "";
      UnformattedAns &&
        UnformattedAns.forEach((item) => {
          allUnformattedAnswer += item.pageContent + " ";
        });
      console.log("Unformattedanswer: ", allUnformattedAnswer);

      // const PROMPT =
      //   "You are an expert tutor preparing answers for exams. " +
      //   "Answer the question as precisely and completely as possible. " +
      //   "Analyze and infer logically to construct a full exam-ready answer, even if the content is partial or messy. " +
      //   "Include both real-world examples (practical scenarios) and technical examples/tools (software, methods, or frameworks) wherever applicable. " +
      //   "When giving examples, underline only the name of the tool, framework, or entity (e.g., <u>Python</u>, <u>Tableau</u>), not the full description. " +
      //   "Format the answer in clean HTML using <p>, <b>, <i>, <u>, <ul>, <li>, <ol> tags. " +
      //   "Highlight key terms or important phrases using <b> or <i>. " +
      //   "Adjust answer style based on the type of question: if it asks for steps, use a numbered list; if it asks for examples, use bullet points; if it asks for explanation, use short paragraphs with key terms highlighted. " +
      //   "Keep each point concise (2–3 sentences) and include one real-world and one technical example if applicable. " +
      //   "Clearly indicate any inferred information as 'inferred from context'. " +
      //   "Structure the answer to cover all key points for full marks. " +
      //   "Do NOT mention the source or say 'based on the document'.\n\n" +
      //   "Question: " +
      //   selectedText +
      //   "\n\n" +
      //   "Document content: " +
      //   allUnformattedAnswer +
      //   "\n\n" +
      //   "Requirements:\n" +
      //   "1. Provide a concise, structured answer suitable for exams.\n" +
      //   "2. Include both real-world and technical/tool examples for each step or concept, with only the names underlined.\n" +
      //   "3. Use numbering and formatting for clarity.\n" +
      //   "4. Mention limitations or inferred parts where content is incomplete.\n" +
      //   "5. Avoid unnecessary repetition or filler text.";

      const PROMPT =
        "You are an expert tutor generating precise, exam-ready answers in clean HTML. " +
        "Rules:\n" +
        "1) Always answer in structured HTML (<p>, <b>, <i>, <u>, <ul>, <li>, <ol>). " +
        "2) Adapt style to the question: steps -> <ol>; examples -> <ul>; explanations -> <p>. " +
        "3) Highlight key terms with <b>/<i>. " +
        "4) Give both one real-world example and one technical/tool example (underline only tool/framework names, e.g., <u>Python</u>). " +
        "5) If information is incomplete, mark it as 'inferred from context'. " +
        "6) Keep points concise (2–3 sentences) and avoid repetition/filler. " +
        "7) Ensure coverage of all key points for full marks. " +
        "Question: " +
        selectedText +
        "\n" +
        "Document content: " +
        allUnformattedAnswer;

      const AiModelResult = await chatSession.sendMessage(PROMPT);
      // console.log(await AiModelResult.response.text());
      const finalAns = await AiModelResult.response.text();

      toast.success("Your answer is ready.", { position: "top-center" });
      setIsLoading(false);
      console.log(finalAns);

      const allText = editor.getHTML();

      editor.commands.setContent(
        allText + "<p><strong>Answer:</strong></p>" + finalAns
      );

      //Save Notes to db
      await saveNotes({
        notes: editor.getHTML(),
        fileId: fileId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });
    } catch (err) {
      console.error("AI generation failed:", err);
      toast.error("Failed to generate answer. Please try again.", {
        position: "top-center",
      });
      setIsLoading(false);
    }
  };

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
      <button
        onClick={() => onAiClick()}
        className="hover:cursor-pointer hover:text-yellow-600 flex items-center"
      >
        <Sparkles
          size={18}
          className={`transition-colors duration-300 ${
            isLoading
              ? "text-yellow-700 animate-ping" // glowing/yellow + sparkling effect
              : "text-gray-700"
          }`}
        />
        {isLoading && (
          <span className="ml-2 text-sm animate-pulse text-gray-500">
            AI is thinking...
          </span>
        )}
      </button>
      {/* Save Button */}
      <button
        onClick={async () => {
          try {
            await saveNotes({
              notes: editor.getHTML(),
              fileId: fileId,
              createdBy: user?.primaryEmailAddress?.emailAddress,
            });
            toast.success("Notes saved successfully!", {
              position: "top-center",
            });
          } catch (err) {
            console.error("Save failed:", err);
            toast.error("Failed to save notes.", { position: "top-center" });
          }
        }}
        className="ml-2 px-3 py-1 rounded border border-black text-black hover:bg-black hover:text-white transition"
        title="Save Notes"
      >
        Save
      </button>
    </div>
  );
};
