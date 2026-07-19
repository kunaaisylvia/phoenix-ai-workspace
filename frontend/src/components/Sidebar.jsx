import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

export default function Sidebar() {
    const navigate = useNavigate();

    const { logout } = useAuth();

    const {
        conversations,
        currentConversation,
        setCurrentConversation,
        newConversation,
    } = useChat();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    async function handleNewChat() {
        await newConversation();
    }

    return (
        <aside className="w-72 bg-[#121A31] border-r border-gray-800 flex flex-col">

            <div className="p-6">

                <h1 className="text-3xl font-bold text-orange-500">
                    🔥 Phoenix
                </h1>

                <button
                    onClick={handleNewChat}
                    className="mt-8 w-full rounded-xl bg-orange-500 py-3 font-semibold hover:bg-orange-600 transition"
                >
                    + New Chat
                </button>

            </div>

            <div className="flex-1 overflow-y-auto px-4">

                {conversations.map((conversation) => (

                    <button
                        key={conversation.id}
                        onClick={() =>
                            setCurrentConversation(conversation)
                        }
                        className={`w-full rounded-lg p-3 mb-2 text-left transition ${
                            currentConversation?.id === conversation.id
                                ? "bg-orange-500"
                                : "bg-[#1D2948] hover:bg-[#26365f]"
                        }`}
                    >
                        {conversation.title}
                    </button>

                ))}

            </div>

            <div className="p-6">

                <button
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-gray-700 py-3 hover:bg-red-500 transition"
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}