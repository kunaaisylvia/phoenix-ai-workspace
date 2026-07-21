import API from "./api";

export async function getWorkspaces() {

    const response = await API.get(
        "/workspaces/"
    );

    return response.data;
}

export async function createWorkspace() {

    const response = await API.post(
        "/workspaces/",
        {
            name: "Phoenix Workspace",
            description: "My AI Workspace",
        }
    );

    return response.data;
}