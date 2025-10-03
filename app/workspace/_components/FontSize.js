// extensions/FontSize.js
import { Mark } from "@tiptap/core";

const FontSize = Mark.create({
  name: "fontSize",

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: element => element.style.fontSize || null,
        renderHTML: attributes => {
          if (!attributes.size) return {};
          return { style: `font-size: ${attributes.size}` };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        style: "font-size",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setFontSize:
        size =>
        ({ commands }) => {
          return commands.setMark(this.name, { size });
        },
      unsetFontSize:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
      toggleFontSize:
        size =>
        ({ commands, editor }) => {
          const isActive = editor.isActive("fontSize", { size });
          if (isActive) {
            return commands.unsetFontSize();
          }
          return commands.setFontSize(size);
        },
    };
  },
});

export default FontSize;
