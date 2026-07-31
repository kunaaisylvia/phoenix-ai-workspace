import { useState } from "react";

import * as workspacesAPI from "../api/workspaces";

export function useWorkspace() {

    const [workspaceId, setWorkspaceId] = useState(null);

    async function initializeWorkspace() {

        try {

            let workspaces =
                await workspacesAPI.getWorkspaces();

            if (workspaces.length === 0) {

                const workspace =
                    await workspacesAPI.createWorkspace();

                workspaces = [workspace];

            }

            setWorkspaceId(workspaces[0].id);

            return workspaces[0].id;

        } catch (err) {

            console.error(err);

            return null;

        }

    }

    return {

        workspaceId,
        initializeWorkspace,

    };

}