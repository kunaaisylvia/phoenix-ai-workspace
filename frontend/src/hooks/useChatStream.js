import { useRef, useState } from "react";

import * as chatAPI from "../api/chat";

export function useChatStream({
    currentConversation,
    workspaceId,
    setMessages,
    loadConversations,
    setCurrentConversation,
}) {

    const [loading, setLoading] = useState(false);

    const abortController = useRef(null);

    async function sendMessage(prompt) {

        if (!currentConversation) return;

        const userMessage = {
            role: "user",
            content: prompt,
        };

        setMessages(prev => [
            ...prev,
            userMessage,
            {
                role: "assistant",
                content: "",
            },
        ]);

        setLoading(true);

        abortController.current =
            new AbortController();

        try {

            const reader =
                await chatAPI.streamMessage(
                    currentConversation.id,
                    prompt,
                    abortController.current.signal
                );

            const decoder = new TextDecoder();

            let fullResponse = "";

            while (true) {

                const { done, value } =
                    await reader.read();

                if (done) break;

                fullResponse +=
                    decoder.decode(value);

                setMessages(prev => {

                    const updated = [...prev];

                    updated[updated.length - 1] = {
                        role: "assistant",
                        content: fullResponse,
                    };

                    return updated;

                });

            }

            const updatedConversations =
                await loadConversations(
                    workspaceId
                );

            const updatedConversation =
                updatedConversations.find(
                    conversation =>
                        conversation.id ===
                        currentConversation.id
                );

            if (updatedConversation) {

                setCurrentConversation(
                    updatedConversation
                );

            }

        } catch (err) {

            if (err.name !== "AbortError") {

                console.error(err);

            }

        } finally {

            abortController.current = null;

            setLoading(false);

        }

    }

    function stopGeneration() {

        if (abortController.current) {

            abortController.current.abort();

        }

    }

    return {

        loading,

        sendMessage,

        stopGeneration,

    };

}