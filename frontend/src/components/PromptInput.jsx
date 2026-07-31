import { useEffect, useRef, useState } from "react";

import { useChat } from "../context/ChatContext";

export default function PromptInput() {

    const [prompt, setPrompt] = useState("");

    const textareaRef = useRef(null);

    const {

        sendMessage,
        stopGeneration,
        loading,
        currentConversation,

    } = useChat();

    useEffect(() => {

        if (!textareaRef.current) return;

        textareaRef.current.style.height = "0px";

        textareaRef.current.style.height =
            `${textareaRef.current.scrollHeight}px`;

    }, [prompt]);

    async function handleSend() {

        if (!prompt.trim()) return;

        await sendMessage(prompt.trim());

        setPrompt("");

        textareaRef.current.style.height = "auto";

    }

    function handleKeyDown(e) {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            if (!loading) {

                handleSend();

            }

        }

    }

    return (

        <div className="border-t border-gray-800 bg-[#0F172A] p-6">

            <div className="mx-auto max-w-4xl">

                <div className="flex items-end gap-4 rounded-2xl border border-gray-700 bg-[#1D2948] p-3">

                    <textarea

                        ref={textareaRef}

                        rows={1}

                        value={prompt}

                        onChange={(e) =>
                            setPrompt(e.target.value)
                        }

                        onKeyDown={handleKeyDown}

                        disabled={
                            !currentConversation ||
                            loading
                        }

                        placeholder={
                            currentConversation
                                ? "Ask Phoenix anything..."
                                : "Create a new chat first..."
                        }

                        className="max-h-60 min-h-[28px] flex-1 resize-none overflow-y-auto bg-transparent text-white outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"

                    />

                    {loading ? (

                        <button

                            onClick={stopGeneration}

                            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"

                        >
                            Stop
                        </button>

                    ) : (

                        <button

                            onClick={handleSend}

                            disabled={
                                !currentConversation ||
                                !prompt.trim()
                            }

                            className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"

                        >
                            Send
                        </button>

                    )}

                </div>

                <p className="mt-3 text-center text-xs text-gray-500">

                    Press <span className="font-semibold">Enter</span> to send ·{" "}
                    <span className="font-semibold">Shift + Enter</span> for a new line

                </p>

            </div>

        </div>

    );

}