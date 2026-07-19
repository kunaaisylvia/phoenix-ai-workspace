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