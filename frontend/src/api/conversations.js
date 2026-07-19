import API from "./api";

export async function getConversations(workspaceId) {
    const token = localStorage.getItem("token");

    const response = await API.get(
        `/conversations/workspace/${workspaceId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function createConversation(workspaceId) {
    const token = localStorage.getItem("token");

    const response = await API.post(
        "/conversations/",
        {
            title: "New Conversation",
            workspace_id: workspaceId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}