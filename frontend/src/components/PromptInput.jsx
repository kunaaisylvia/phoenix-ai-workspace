import { useRef, useState } from "react";

import { useChat } from "../context/ChatContext";
import FileChip from "./FileChip";

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

    const fileIds = files.map(file => file.id);

    await sendMessage(prompt, fileIds);

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

                        <FileChip

                            key={file.id}

                            file={file}

                            onRemove={removeFile}

                        />

                    ))}

                </div>

            )}

            {/* Prompt */}

            <div className="flex items-center gap-4">

                {/* Attach File */}

                <button

                    type="button"

                    onClick={() =>
                        fileInputRef.current?.click()
                    }

                    disabled={
                        uploading ||
                        loading
                    }

                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#1D2948]
                        text-lg
                        transition
                        hover:bg-[#26365E]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "

                >

                    {uploading
                        ? "..."
                        : "📎"}

                </button>

                <input

                    ref={fileInputRef}

                    type="file"

                    hidden

                    onChange={handleFileChange}

                />

                {/* Prompt Input */}

                <input

                    value={prompt}

                    onChange={(e) =>
                        setPrompt(e.target.value)
                    }

                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter" &&
                            !e.shiftKey
                        ) {

                            e.preventDefault();

                            handleSend();

                        }

                    }}

                    disabled={
                        !currentConversation ||
                        uploading
                    }

                    placeholder={
                        currentConversation
                            ? "Ask Phoenix anything..."
                            : "Create a new chat first..."
                    }

                    className="
                        flex-1
                        rounded-xl
                        bg-[#1D2948]
                        px-5
                        py-4
                        outline-none
                        placeholder:text-gray-400
                    "

                />

                {/* Send / Stop */}

                <button

                    type="button"

                    onClick={
                        loading
                            ? stopGeneration
                            : handleSend
                    }

                    disabled={
                        uploading ||
                        (!loading &&
                            !currentConversation)
                    }

                    className="
                        rounded-xl
                        bg-orange-500
                        px-8
                        py-4
                        font-semibold
                        text-white
                        transition
                        hover:bg-orange-600
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "

                >

                    {loading
                        ? "Stop"
                        : "Send"}

                </button>

            </div>

        </div>

    );

}