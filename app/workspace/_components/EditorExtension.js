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
  Sparkles,
} from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { chatSession } from "@/configs/AiModel";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useUser } from "@clerk/nextjs";

export const EditorExtension = ({ editor, fileId }) => {
  const [, setTick] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { user } = useUser();

  const searchAI = useAction(api.myAction.search);
  const saveNotes = useMutation(api.notes.AddNotes);

  const onAiClick = async () => {
    try {
      toast("Wait answer getting generated", { position: "top-center" });
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        " "
      );
      setIsLoading(true);

      const UnformattedAns = await searchAI({
        query: selectedText,
        fileId: id,
      });

      let allUnformattedAnswer = "";
      UnformattedAns &&
        UnformattedAns.forEach((item) => {
          allUnformattedAnswer += item.pageContent + " ";
        });

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
      const finalAns = await AiModelResult.response.text();

      toast.success("Your answer is ready.", { position: "top-center" });
      setIsLoading(false);

      const allText = editor.getHTML();
      editor.commands.setContent(
        allText + "<p><strong>Answer:</strong></p>" + finalAns
      );

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
      {/* Header sizes */}
      <button
        onClick={() => editor.chain().focus().toggleFontSize("2rem").run()}
        className={btn(editor.isActive("fontSize", { size: "2rem" }))}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleFontSize("1.5rem").run()}
        className={btn(editor.isActive("fontSize", { size: "1.5rem" }))}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleFontSize("1.25rem").run()}
        className={btn(editor.isActive("fontSize", { size: "1.25rem" }))}
      >
        H3
      </button>

      {/* Formatting buttons */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive("bold"))}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive("italic"))}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btn(editor.isActive("underline"))}
        title="Underline"
      >
        <Underline size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={btn(editor.isActive("highlight"))}
        title="Highlight"
      >
        <Highlighter size={18} />
      </button>

      {/* Lists & Alignment */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive("bulletList"))}
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={btn(editor.isActive({ textAlign: "left" }))}
      >
        <AlignLeft size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={btn(editor.isActive({ textAlign: "center" }))}
      >
        <AlignCenter size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={btn(editor.isActive({ textAlign: "right" }))}
      >
        <AlignRight size={18} />
      </button>

      {/* AI Button */}
      <button
        onClick={onAiClick}
        className="hover:cursor-pointer hover:text-yellow-600 flex items-center"
      >
        <Sparkles
          size={18}
          className={`transition-colors duration-300 ${
            isLoading ? "text-yellow-700 animate-ping" : "text-gray-700"
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
      >
        Save
      </button>

      {/* --- CORRECTED DOWNLOAD BUTTON --- */}
      <button
        onClick={async () => {
          try {
            const editorContainer = document.querySelector(".ProseMirror");
            if (!editorContainer) {
              toast.error("No content found to export.");
              return;
            }

            // Clone content for PDF rendering
            const clone = editorContainer.cloneNode(true);
            clone.style.background = "#fff";
            clone.style.padding = "25px";
            clone.style.width = "210mm";
            clone.style.boxSizing = "border-box";
            document.body.appendChild(clone);

            // Convert editor to canvas
            const canvas = await html2canvas(clone, {
              scale: 2,
              useCORS: true,
              scrollY: -window.scrollY,
            });
            const imgData = canvas.toDataURL("image/png");

            // Initialize PDF
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Margins & layout
            const borderMargin = 10; // distance of black border from edge
            const innerPadding = 6; // content padding inside the border

            const startX = borderMargin + innerPadding;
            const startY = borderMargin + innerPadding;
            const usableWidth = pageWidth - (borderMargin + innerPadding) * 2;
            const usableHeight = pageHeight - (borderMargin + innerPadding) * 2;

            // Scale image to fit within usable width
            const imgWidth = usableWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = startY;

            // Add first page content
            pdf.addImage(imgData, "PNG", startX, position, imgWidth, imgHeight);
            heightLeft -= usableHeight;

            // Add more pages if needed
            while (heightLeft > 0) {
              pdf.addPage();
              position = heightLeft - imgHeight + startY;
              pdf.addImage(
                imgData,
                "PNG",
                startX,
                position,
                imgWidth,
                imgHeight
              );
              heightLeft -= usableHeight;
            }

            // Add borders and page numbers for each page
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
              pdf.setPage(i);

              // Draw black border
              pdf.setDrawColor(0, 0, 0);
              pdf.setLineWidth(0.6);
              pdf.rect(
                borderMargin,
                borderMargin,
                pageWidth - borderMargin * 2,
                pageHeight - borderMargin * 2
              );

              // Add page numbers (centered bottom, inside border)
              pdf.setFontSize(10);
              pdf.setTextColor(60);
              pdf.text(
                `Page ${i} of ${totalPages}`,
                pageWidth / 2,
                pageHeight - borderMargin - 3,
                { align: "center" }
              );
            }

            pdf.save("notes.pdf");
            document.body.removeChild(clone);
          } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Failed to generate PDF. Try again.");
          }
        }}
        className="ml-2 px-3 py-1 rounded border border-gray-500 text-gray-700 hover:bg-black hover:text-white transition"
      >
        Download Notes
      </button>
    </div>
  );
};
