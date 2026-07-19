import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import * as conversationsAPI from "../api/conversations";
import * as chatAPI from "../api/chat";

const ChatContext = createContext();

// Temporary workspace
const DEFAULT_WORKSPACE_ID = 2;

export function ChatProvider({ children }) {

    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

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

            setCurrentConversation(conversation);

            setMessages([]);

            return conversation;

        } catch (err) {

            console.error(err);

        }

    }

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

    useEffect(() => {

        loadConversations();

    }, []);

    return (

        <ChatContext.Provider
            value={{
                conversations,
                currentConversation,
                setCurrentConversation,
                messages,
                loading,
                newConversation,
                sendMessage,
            }}
        >

            {children}

        </ChatContext.Provider>

    );

}

export function useChat() {

    return useContext(ChatContext);

}