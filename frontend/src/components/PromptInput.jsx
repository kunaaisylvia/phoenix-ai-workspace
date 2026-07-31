import { useRef, useState } from "react";

import { useChat } from "../context/ChatContext";

export default function PromptInput() {

    const [prompt, setPrompt] = useState("");

    const fileInputRef = useRef(null);

    const {

        sendMessage,

        stopGeneration,

        loading,

        currentConversation,

        files,

        uploading,

        uploadFile,

        removeFile,

    } = useChat();

    async function handleSend() {

        if (!prompt.trim()) return;

        await sendMessage(prompt);

        setPrompt("");

    }

    async function handleFileChange(event) {

        const file = event.target.files?.[0];

        if (!file) return;

        await uploadFile(file);

        event.target.value = "";

    }

    return (

        <div className="border-t border-gray-800 p-6">

            {/* Uploaded Files */}

            {files.length > 0 && (

                <div className="mb-4 flex flex-wrap gap-2">

                    {files.map(file => (

                        <div
                            key={file.id}
                            className="flex items-center gap-2 rounded-lg bg-[#1D2948] px-4 py-2"
                        >

                            <span>
                                📄 {file.original_name}
                            </span>

                            <button
                                onClick={() =>
                                    removeFile(file.id)
                                }
                                className="text-red-400 hover:text-red-500"
                            >
                                ✕
                            </button>

                        </div>

                    ))}

                </div>

            )}

            <div className="flex gap-4">

                <button

                    onClick={() =>
                        fileInputRef.current.click()
                    }

                    disabled={uploading}

                    className="rounded-xl bg-[#1D2948] px-4 hover:bg-[#26365e]"

                >

                    📎

                </button>

                <input

                    ref={fileInputRef}

                    type="file"

                    hidden

                    onChange={handleFileChange}

                />

                <input

                    value={prompt}

                    onChange={(e) =>
                        setPrompt(e.target.value)
                    }

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            handleSend();

                        }

                    }}

                    disabled={!currentConversation}

                    placeholder={
                        currentConversation
                            ? "Ask Phoenix anything..."
                            : "Create a new chat first..."
                    }

                    className="flex-1 rounded-xl bg-[#1D2948] px-5 py-4 outline-none"

                />

                <button

                    onClick={
                        loading
                            ? stopGeneration
                            : handleSend
                    }

                    disabled={
                        !loading &&
                        !currentConversation
                    }

                    className="rounded-xl bg-orange-500 px-8 font-semibold hover:bg-orange-600 disabled:opacity-50"

                >

                    {loading
                        ? "Stop"
                        : "Send"}

                </button>

            </div>

        </div>

    );

}