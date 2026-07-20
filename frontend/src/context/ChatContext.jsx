import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import * as conversationsAPI from "../api/conversations";
import * as messagesAPI from "../api/messages";
import * as chatAPI from "../api/chat";

const ChatContext = createContext();

const DEFAULT_WORKSPACE_ID = 3;

export function ChatProvider({ children }) {

    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // ----------------------------
    // Load all conversations
    // ----------------------------

    async function loadConversations() {

        try {

            const data =
                await conversationsAPI.getConversations(
                    DEFAULT_WORKSPACE_ID
                );

            setConversations(data);

        } catch (err) {

            console.error(err);

        }

    }

    // ----------------------------
    // Load messages
    // ----------------------------

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

    // ----------------------------
    // Select conversation
    // ----------------------------

    async function selectConversation(conversation) {

        setCurrentConversation(conversation);

        await loadMessages(conversation.id);

    }

    // ----------------------------
    // Create conversation
    // ----------------------------

    async function newConversation() {

        try {

            const conversation =
                await conversationsAPI.createConversation(
                    DEFAULT_WORKSPACE_ID
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

    // ----------------------------
    // Send message
    // ----------------------------

    async function sendMessage(prompt) {

        if (!currentConversation) return;

        const userMessage = {
            role: "user",
            content: prompt,
        };

        setMessages(prev => [
            ...prev,
            userMessage,
        ]);

        setLoading(true);

        try {

            const response =
                await chatAPI.sendMessage(
                    currentConversation.id,
                    prompt
                );

            const assistantMessage = {
                role: "assistant",
                content: response.response,
            };

            setMessages(prev => [
                ...prev,
                assistantMessage,
            ]);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }

    // ----------------------------
    // Initial load
    // ----------------------------

    useEffect(() => {

        loadConversations();

    }, []);

    return (

        <ChatContext.Provider
            value={{
                conversations,
                currentConversation,
                selectConversation,
                messages,
                loading,
                newConversation,
                sendMessage,
                loadMessages,
            }}
        >

            {children}

        </ChatContext.Provider>

    );

}

export function useChat() {

    return useContext(ChatContext);

}