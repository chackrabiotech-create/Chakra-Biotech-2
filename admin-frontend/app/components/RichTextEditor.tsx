"use client";

import { useRef, useEffect, useCallback } from "react";
import {
    Bold, Italic, Underline, Strikethrough,
    List, ListOrdered, Link, Minus,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: number;
    className?: string;
}

type FormatCommand =
    | "bold" | "italic" | "underline" | "strikeThrough"
    | "insertUnorderedList" | "insertOrderedList"
    | "insertHorizontalRule";

interface ToolbarButton {
    icon: React.ReactNode;
    command: FormatCommand;
    title: string;
}

const TOOLS: ToolbarButton[] = [
    { icon: <Bold className="w-3.5 h-3.5" />, command: "bold", title: "Bold (Ctrl+B)" },
    { icon: <Italic className="w-3.5 h-3.5" />, command: "italic", title: "Italic (Ctrl+I)" },
    { icon: <Underline className="w-3.5 h-3.5" />, command: "underline", title: "Underline (Ctrl+U)" },
    { icon: <Strikethrough className="w-3.5 h-3.5" />, command: "strikeThrough", title: "Strikethrough" },
    { icon: <List className="w-3.5 h-3.5" />, command: "insertUnorderedList", title: "Bullet List" },
    { icon: <ListOrdered className="w-3.5 h-3.5" />, command: "insertOrderedList", title: "Numbered List" },
    { icon: <Minus className="w-3.5 h-3.5" />, command: "insertHorizontalRule", title: "Divider" },
];

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Start typing…",
    minHeight = 120,
    className = "",
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    // track whether we already set the initial content
    const initialised = useRef(false);

    // Sync external `value` → DOM only on first mount or when value cleared externally
    useEffect(() => {
        const el = editorRef.current;
        if (!el) return;
        if (!initialised.current) {
            el.innerHTML = value || "";
            initialised.current = true;
            return;
        }
        // If parent clears value (e.g. form reset) reflect it
        if (!value && el.innerHTML) {
            el.innerHTML = "";
        }
    }, [value]);

    const exec = useCallback((command: FormatCommand) => {
        editorRef.current?.focus();
        document.execCommand(command, false);
        // Fire onChange after command
        if (editorRef.current) onChange(editorRef.current.innerHTML);
    }, [onChange]);

    const handleLink = useCallback(() => {
        const url = window.prompt("Enter URL:", "https://");
        if (url) {
            editorRef.current?.focus();
            document.execCommand("createLink", false, url);
            if (editorRef.current) onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    const handleInput = useCallback(() => {
        if (editorRef.current) onChange(editorRef.current.innerHTML);
    }, [onChange]);

    return (
        <div className={`rounded-xl border border-admin-200 overflow-hidden bg-white ${className}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-admin-50 border-b border-admin-200">
                {TOOLS.map(({ icon, command, title }) => (
                    <button
                        key={command}
                        type="button"
                        title={title}
                        onMouseDown={e => { e.preventDefault(); exec(command); }}
                        className="p-1.5 rounded-md text-admin-600 hover:bg-admin-200 hover:text-admin-900 transition-colors"
                    >
                        {icon}
                    </button>
                ))}
                {/* Separator */}
                <div className="w-px h-5 bg-admin-200 mx-1" />
                <button
                    type="button"
                    title="Insert Link"
                    onMouseDown={e => { e.preventDefault(); handleLink(); }}
                    className="p-1.5 rounded-md text-admin-600 hover:bg-admin-200 hover:text-admin-900 transition-colors"
                >
                    <Link className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Editable area */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                data-placeholder={placeholder}
                style={{ minHeight }}
                className={`
          px-4 py-3 text-sm text-admin-800 leading-relaxed outline-none
          prose prose-sm max-w-none
          [&:empty]:before:content-[attr(data-placeholder)]
          [&:empty]:before:text-admin-300
          [&:empty]:before:pointer-events-none
          [&_ul]:list-disc [&_ul]:pl-5
          [&_ol]:list-decimal [&_ol]:pl-5
          [&_a]:text-saffron-600 [&_a]:underline
          focus:ring-0
        `}
            />
        </div>
    );
}
