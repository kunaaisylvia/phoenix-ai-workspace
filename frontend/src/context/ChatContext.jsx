import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useAuth } from "./AuthContext";

import * as conversationsAPI from "../api/conversations";
import * as messagesAPI from "../api/messages";
import * as chatAPI from "../api/chat";
import * as workspacesAPI from "../api/workspaces";

const ChatContext = createContext();

export function ChatProvider({ children }) {

    const { authenticated } = useAuth();

    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [workspaceId, setWorkspaceId] = useState(null);

    // ----------------------------
    // Initialize Workspace
    // ----------------------------

    async function initializeWorkspace() {

        try {

            let workspaces =
                await workspacesAPI.getWorkspaces();

            if (workspaces.length === 0) {

                const workspace =
                    await workspacesAPI.createWorkspace();

                workspaces = [workspace];

            }

            setWorkspaceId(workspaces[0].id);

            return workspaces[0].id;

        } catch (err) {

            console.error(err);

            return null;

        }

    }

    // ----------------------------
    // Load Conversations
    // ----------------------------

    async function loadConversations(id) {

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

    // ----------------------------
    // Load Messages
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
    // Select Conversation
    // ----------------------------

    async function selectConversation(conversation) {

        setCurrentConversation(conversation);

        await loadMessages(conversation.id);

    }

    // ----------------------------
    // New Conversation
    // ----------------------------

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

    // ----------------------------
    // Send Message
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

            const updatedConversations =
                await loadConversations(workspaceId);

            const updatedConversation =
                updatedConversations.find(
                    (conversation) =>
                        conversation.id === currentConversation.id
                );

            if (updatedConversation) {

                setCurrentConversation(updatedConversation);

            }

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }

    // ----------------------------
    // Initialize AFTER Login
    // ----------------------------

    useEffect(() => {

        if (!authenticated) return;

        async function initialize() {

            const id =
                await initializeWorkspace();

            if (!id) return;

            const conversations =
                await loadConversations(id);

            if (
                conversations.length > 0 &&
                !currentConversation
            ) {

                await selectConversation(
                    conversations[0]
                );

            }

        }

        initialize();

    }, [authenticated]);

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