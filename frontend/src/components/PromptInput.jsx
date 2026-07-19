import { useState } from "react";

import { useChat } from "../context/ChatContext";

export default function PromptInput() {

    const [prompt, setPrompt] = useState("");

    const {
        sendMessage,
        loading,
        currentConversation,
    } = useChat();

    async function handleSend() {

        if (!prompt.trim()) return;

        await sendMessage(prompt);

        setPrompt("");

    }

    return (

        <div className="border-t border-gray-800 p-6">

            <div className="flex gap-4">

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
                    onClick={handleSend}
                    disabled={
                        loading || !currentConversation
                    }
                    className="rounded-xl bg-orange-500 px-8 font-semibold hover:bg-orange-600 disabled:opacity-50"
                >
                    {loading ? "..." : "Send"}
                </button>

            </div>

        </div>

    );

}