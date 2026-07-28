import { useChat } from "../context/ChatContext";
import MarkdownMessage from "./MarkdownMessage";

export default function ChatArea() {

    const { messages } = useChat();

    if (messages.length === 0) {

        return (

            <main className="flex-1 flex items-center justify-center">

                <div className="text-center">

                    <h1 className="text-5xl font-bold">
                        Welcome to
                        <span className="text-orange-500">
                            {" "}Phoenix
                        </span>
                    </h1>

                    <p className="mt-4 text-gray-400">
                        Start a conversation.
                    </p>

                </div>

            </main>

        );

    }

    return (

        <main className="flex-1 overflow-y-auto p-8 space-y-6">

            {messages.map((message, index) => (

                <div
                    key={index}
                    className={`max-w-3xl rounded-xl p-4 whitespace-pre-wrap ${
                        message.role === "user"
                            ? "ml-auto bg-orange-500 text-white"
                            : "mr-auto bg-[#1D2948] text-white"
                    }`}
                >

                    {message.role === "assistant" ? (

                        <MarkdownMessage>
                            {message.content}
                        </MarkdownMessage>

                    ) : (

                        message.content

                    )}

                </div>

            ))}

        </main>

    );

}