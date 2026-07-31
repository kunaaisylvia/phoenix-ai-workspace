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

        // Prevent multiple simultaneous streams
        if (loading) return;

        const userMessage = {
            role: "user",
            content: prompt,
        };

        const assistantMessage = {
            role: "assistant",
            content: "",
        };

        setMessages(prev => [
            ...prev,
            userMessage,
            assistantMessage,
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

                const {
                    done,
                    value,
                } = await reader.read();

                if (done) break;

                fullResponse += decoder.decode(
                    value,
                    {
                        stream: true,
                    }
                );

                setMessages(prev => {

                    const updated = [...prev];

                    updated[
                        updated.length - 1
                    ] = {

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

                console.error(
                    "Streaming failed:",
                    err
                );

            }

        } finally {

            abortController.current = null;

            setLoading(false);

        }

    }

    function stopGeneration() {

        if (!abortController.current) return;

        abortController.current.abort();

        abortController.current = null;

        setLoading(false);

    }

    return {

        loading,

        sendMessage,

        stopGeneration,

    };

}