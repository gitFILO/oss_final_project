"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import { Toolbar } from "./toolBar";
import HighLight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import React from "react";

export default function Tiptap({
  description,
  onChange,
  id,
}: {
  description: string;
  onChange: (richText: string) => void;
  id: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Text,
      TextStyle,
      Color,
      HighLight,
      Heading.configure({
        //heading 이 중복 선언되었다는데 어디?!!
        HTMLAttributes: {
          class: "text-xl font-bold",
          levels: [2],
        },
      }),
      // Heading,
    ],
    content: description,
    editorProps: {
      attributes: {
        class: "min-h-[150px] ",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      // console.log(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col justify-stretch ">
      <div className="mb-3 flex">
        <Toolbar editor={editor} />
      </div>

      <div className="border rounded-lg">
        <EditorContent id={"markdownHolder " + id} editor={editor} />
      </div>
    </div>
  );
}
