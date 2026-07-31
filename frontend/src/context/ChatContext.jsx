import {
    createContext,
    useContext,
    useEffect,
} from "react";

import { useAuth } from "./AuthContext";

import { useWorkspace } from "../hooks/useWorkspace";
import { useConversations } from "../hooks/useConversations";
import { useChatStream } from "../hooks/useChatStream";
import { useFiles } from "../hooks/useFiles";

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
    // Files
    // ----------------------------

    const {

        files,

        uploading,

        uploadFile,

        removeFile,

        clearFiles,

    } = useFiles(
        workspaceId,
        currentConversation
    );

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

        clearFiles,

    });

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

    // ----------------------------
    // Provider
    // ----------------------------

    return (

        <ChatContext.Provider
            value={{

                // Conversations

                conversations,

                currentConversation,

                selectConversation,

                newConversation,

                loadMessages,

                // Messages

                messages,

                // Chat

                loading,

                sendMessage,

                stopGeneration,

                // Files

                files,

                uploading,

                uploadFile,

                removeFile,

                clearFiles,

            }}
        >

            {children}

        </ChatContext.Provider>

    );

}

export function useChat() {

    return useContext(ChatContext);

}