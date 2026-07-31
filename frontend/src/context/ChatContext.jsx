import {
    createContext,
    useContext,
    useEffect,
} from "react";

import { useAuth } from "./AuthContext";

import { useWorkspace } from "../hooks/useWorkspace";
import { useConversations } from "../hooks/useConversations";
import { useChatStream } from "../hooks/useChatStream";

const ChatContext = createContext();

export function ChatProvider({ children }) {

    const { authenticated } = useAuth();

    // ----------------------------
    // Workspace
    // ----------------------------

    const {
        workspaceId,
        initializeWorkspace,
    } = useWorkspace();

    // ----------------------------
    // Conversations
    // ----------------------------

    const {
        conversations,
        currentConversation,
        messages,

        setMessages,
        setCurrentConversation,

        loadConversations,
        loadMessages,
        selectConversation,
        newConversation,

    } = useConversations(workspaceId);

    // ----------------------------
    // Chat Streaming
    // ----------------------------

    const {
        loading,
        sendMessage,
        stopGeneration,
    } = useChatStream({

        currentConversation,
        workspaceId,

        setMessages,
        loadConversations,
        setCurrentConversation,

    });

    // ----------------------------
    // Initialize After Login
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

                stopGeneration,

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