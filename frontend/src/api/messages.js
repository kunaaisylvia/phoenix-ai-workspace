import API from "./api";

export async function getMessages(conversationId) {
    const token = localStorage.getItem("token");

    const response = await API.get(
        `/messages/conversation/${conversationId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}