import { useState } from "react";

import * as conversationsAPI from "../api/conversations";
import * as messagesAPI from "../api/messages";

export function useConversations(workspaceId) {

    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);

    async function loadConversations(id = workspaceId) {

        try {

            const data =
                await conversationsAPI.getConversations(id);

            setConversations(data);

            return data;

        } catch (err) {

            console.error(err);

            return [];

        }

    }

    async function loadMessages(conversationId) {

        try {

            const data =
                await messagesAPI.getMessages(
                    conversationId
                );

            setMessages(data);

        } catch (err) {

            console.error(err);

        }

    }

    async function selectConversation(conversation) {

        setCurrentConversation(conversation);

        await loadMessages(conversation.id);

    }

    async function newConversation() {

        if (!workspaceId) return;

        try {

            const conversation =
                await conversationsAPI.createConversation(
                    workspaceId
                );

            setConversations(prev => [
                conversation,
                ...prev,
            ]);

            await selectConversation(conversation);

            return conversation;

        } catch (err) {

            console.error(err);

        }

    }

    return {

        conversations,
        currentConversation,
        messages,

        setMessages,
        setCurrentConversation,

        loadConversations,
        loadMessages,
        selectConversation,
        newConversation,

    };

}