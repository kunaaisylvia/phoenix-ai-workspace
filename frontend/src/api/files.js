import API from "./api";

export async function uploadFile(
    file,
    workspaceId,
    conversationId = null,
) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("workspace_id", workspaceId);

    if (conversationId) {
        formData.append(
            "conversation_id",
            conversationId
        );
    }

    const response = await API.post(
        "/files/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}