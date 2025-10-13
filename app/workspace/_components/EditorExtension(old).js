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
// import html2pdf from "html2pdf.js";
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

      //! Current prompt
      // const PROMPT =
      //   "You are an expert tutor generating precise, exam-ready answers in clean HTML. " +
      //   "Rules:\n" +
      //   "1) Always answer in structured HTML (<p>, <b>, <i>, <u>, <ul>, <li>, <ol>). " +
      //   "2) Adapt style to the question: steps -> <ol>; examples -> <ul>; explanations -> <p>. " +
      //   "3) Highlight key terms with <b>/<i>. " +
      //   "4) Give both one real-world example and one technical/tool example (underline only tool/framework names, e.g., <u>Python</u>). " +
      //   "5) If information is incomplete, mark it as 'inferred from context'. " +
      //   "6) Keep points concise (2–3 sentences) and avoid repetition/filler. " +
      //   "7) Ensure coverage of all key points for full marks. " +
      //   "Question: " +
      //   selectedText +
      //   "\n" +
      //   "Document content: " +
      //   allUnformattedAnswer;

      //! Prompt 3
      // const PROMPT =
      //   "You are an expert tutor generating precise, exam-ready answers in clean HTML. " +
      //   "Rules:\n" +
      //   "1) Always answer in structured HTML (<p>, <b>, <i>, <u>, <ul>, <li>, <ol>, <table>, <tr>, <td>, <th>). " +
      //   "2) Adapt style based on marks requested in the question:\n" +
      //   "   - For high marks (e.g., 13): divide answer into clear topics, provide at least 3 concise points under each topic, and include at least one <i>technical/tool example</i> per topic.\n" +
      //   "   - For medium marks (e.g., 7): fewer topics, 2 concise points each, include a technical/tool example if relevant.\n" +
      //   "   - For low marks (e.g., 5-6): short answers, 1-2 points per topic, include technical/tool examples only if requested.\n" +
      //   "   - For very low marks (e.g., 2): extremely concise answer, 2-3 sentences maximum, only key concepts, no examples unless explicitly requested.\n" +
      //   "3) Highlight key terms with <b>/<i>, and underline tool/framework names (e.g., <u>Python</u>). " +
      //   "4) Include examples (real-world or technical/tool) only if the user explicitly requests them in the question. " +
      //   "5) If the user asks for a comparison or comparison table, present it in a clear HTML <table> format with headers and concise points. " +
      //   "6) If information is missing, phrase it naturally (e.g., 'commonly, tools include…'). " +
      //   "7) Keep each point concise (2–3 sentences max), avoid repetition, and focus on clarity. " +
      //   "8) Ensure coverage of all key points for full marks. " +
      //   "9) Adjust length, depth, structure, and format naturally based on how the user frames the question. " +
      //   "Question: " +
      //   selectedText +
      //   "\n" +
      //   "Document content: " +
      //   allUnformattedAnswer;

      //! Prompt 4

      // const PROMPT =
      //   "You are an expert tutor generating precise, exam-ready answers in clean HTML. " +
      //   "Rules:\n" +
      //   "1) Always answer in structured HTML (<p>, <b>, <strong>, <i>, <u>, <ul>, <li>, <ol>, <table>, <tr>, <th>, <td>). " +
      //   "2) Topic or subtopic headings must be wrapped in <b> or <strong> to clearly distinguish them. " +
      //   "3) Use simple, clear language when the user requests a 'simple explanation'; avoid long technical paragraphs. " +
      //   "4) Adapt the answer structure based on marks requested in the question:\n" +
      //   "   - 13 marks: Divide answer into clear topics, provide at least 3 concise points per topic, include one <i>technical/tool example</i> per topic.\n" +
      //   "   - 7 marks: Fewer topics, 2 concise points per topic, optional technical/tool example.\n" +
      //   "   - 5-6 marks: Short answer, 1-2 points per topic, only key technical/tool examples if requested.\n" +
      //   "   - 2 marks: Very short answer, 2-3 sentences maximum, only key concepts, no examples unless explicitly requested.\n" +
      //   "5) Highlight key terms with <b>/<i>, and underline tool/framework names (e.g., <u>Python</u>). " +
      //   "6) Include examples (real-world or technical/tool) only if the user explicitly requests them in the question. " +
      //   "7) If the user asks for a comparison or table, present it in a clear HTML <table> format with concise points. " +
      //   "8) Keep each point concise (2–3 sentences), avoid repetition, and focus on clarity. " +
      //   "9) Adjust length, depth, structure, and format naturally based on how the user frames the question. " +
      //   "Question: " +
      //   selectedText +
      //   "\n" +
      //   "Document content: " +
      //   allUnformattedAnswer;

      //! Prompt 5
      const PROMPT =
        "You are an expert academic tutor and technical writer specializing in generating well-structured, exam-ready answers. " +
        "Your goal is to produce clear, logically organized, and complete explanations, similar to a top-scoring university exam answer. " +
        "Follow these rules strictly:\n\n" +
        "1) Always write in structured <HTML> format using <p>, <b>, <strong>, <i>, <u>, <ul>, <ol>, <li>, <table>, <tr>, <th>, <td>.\n" +
        "2) Begin each answer with a short <b>Introduction</b> that defines the concept or sets the context.\n" +
        "3) Use clear <b>subheadings</b> for each major section (e.g., 'Definition', 'Importance', 'Advantages', 'Applications', 'Conclusion').\n" +
        "4) Write in simple, professional, and exam-appropriate English — avoid jargon or overly technical language unless required.\n" +
        "5) Use bullet points (<ul><li></li></ul>) for listing explanations or steps, and number them when sequence matters.\n" +
        "6) Always include a <b>Conclusion</b> summarizing the key idea or relevance of the topic.\n" +
        "7) Highlight key terms and keywords using <b> or <i>, and underline important tools, technologies, or frameworks (e.g., <u>Hadoop</u>, <u>Python</u>).\n" +
        "8) Adjust depth and detail according to the marks:\n" +
        "   - 13 marks: Include introduction, 6–8 detailed subpoints or sections, one short real-world or technical example per key section, and a solid conclusion.\n" +
        "   - 7 marks: Include introduction, 3–4 subpoints with brief examples, and conclusion.\n" +
        "   - 5–6 marks: Include introduction, 2–3 key subpoints, and concise conclusion.\n" +
        "   - 2 marks: Give a very short definition or summary in 2–3 sentences.\n" +
        "9) Maintain exam readability — use short paragraphs, clear logical flow, and well-separated sections.\n" +
        "10) If the question asks for comparison or differences, present them neatly in a <table>.\n" +
        "11) Always focus on clarity, flow, and conceptual accuracy over excessive length.\n\n" +
        "Question: " +
        selectedText +
        "\n\n" +
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
      {/*Download button*/}
      <button
        onClick={async () => {
          const content = editor.getHTML();

          // Create temporary container
          const element = document.createElement("div");
          element.innerHTML = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1, h2, h3 { color: #333; }
            p { margin-bottom: 10px; }
            ul, ol { margin-left: 20px; }
            strong, b { font-weight: bold; }
            i { font-style: italic; }
            u { text-decoration: underline; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `;

          // Dynamic import inside the handler
          const html2pdf = (await import("html2pdf.js")).default;

          const opt = {
            margin: 0.5,
            filename: "notes.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
          };

          html2pdf().set(opt).from(element).save();
        }}
        className="ml-2 px-3 py-1 rounded border border-gray-500 text-gray-700 hover:bg-black hover:text-white transition"
        title="Download Notes as PDF"
      >
        Download Notes
      </button>
    </div>
  );
};
