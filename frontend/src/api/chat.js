import API from "./api";

export async function sendMessage(
    conversationId,
    prompt
) {
    const token = localStorage.getItem("token");

    const response = await API.post(
        `/chat/${conversationId}`,
        {
            prompt,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function streamMessage(
    conversationId,
    prompt
) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://127.0.0.1:8000/chat/stream/${conversationId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                prompt,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Streaming failed");
    }

    return response.body.getReader();
}