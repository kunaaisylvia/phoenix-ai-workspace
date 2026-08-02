import API from "./api";

export async function sendMessage(
    conversationId,
    prompt,
    fileIds = []
) {
    const token = localStorage.getItem("token");

    const response = await API.post(
        `/chat/${conversationId}`,
        {
            prompt,
            file_ids: fileIds,
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
    prompt,
    fileIds = [],
    signal
) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://127.0.0.1:8000/chat/stream/${conversationId}`,
        {
            method: "POST",
            signal,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                prompt,
                file_ids: fileIds,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Streaming failed");
    }

    return response.body.getReader();
}