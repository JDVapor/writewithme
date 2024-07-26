"use client";
import React, { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import Text from "@tiptap/extension-text";
import axios from "axios";
import { WorkType } from "@/lib/db/schema";
import { useCompletion } from "ai/react";

type Props = { work: WorkType };

const TipTapEditor = ({ work }: Props) => {
  const [editorState, setEditorState] = React.useState(
    work.editorState || `<h1>${work.name}</h1>`
  );
  const { complete, completion } = useCompletion({
    api: "/api/completion",
  });
  const saveWork = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveWork", {
        workId: work.id,
        editorState,
      });
      return response.data;
    },
  });
  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-Space": () => {
          // take the last 100 words
          const prompt = this.editor.getText().split(" ").slice(-100).join(" ");
          console.log(prompt);
          complete(prompt);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });
  const lastCompletion = useRef("");

  // Define the type for the ref
  const editorContentRef = useRef<HTMLDivElement | null>(null);

  // Effect to insert completion text
  useEffect(() => {
    if (!completion || !editor) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    editor.commands.insertContent(diff);
  }, [completion, editor]);

  // ResizeObserver to monitor changes in editor content height
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (editorContentRef.current) {
        const rect = editorContentRef.current.getBoundingClientRect();
        if (rect.bottom < window.innerHeight) {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
        }
      }
    });

    if (editorContentRef.current) {
      resizeObserver.observe(editorContentRef.current);
    }

    return () => {
      if (editorContentRef.current) {
        resizeObserver.unobserve(editorContentRef.current);
      }
    };
  }, [editorContentRef]);

  // Debounced state saving
  const debouncedEditorState = useDebounce(editorState, 500);
  useEffect(() => {
    if (debouncedEditorState === "") return;
    saveWork.mutate(undefined, {
      onSuccess: (data) => {
        console.log("success update!", data);
      },
      onError: (err) => {
        console.error(err);
      },
    });
  }, [debouncedEditorState]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        {editor && <TipTapMenuBar editor={editor} />}
        <Button disabled variant={"outline"}>
          {saveWork.isLoading ? "Saving..." : "Saved"}
        </Button>
      </div>

      <div className="prose prose-custom w-full mt-4">
        <div ref={editorContentRef} className="editor-content w-full">
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="h-4"></div>
      <span className="text-sm">
        Tip: Press{" "}
        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
          Shift + Spacebar
        </kbd>{" "}
        for AI autocomplete
      </span>

      <style jsx>{`
        .editor-content .ProseMirror {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
      `}</style>
    </>
  );
};

export default TipTapEditor;
