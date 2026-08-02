import { useState } from "react";

import * as filesAPI from "../api/files";

export function useFiles(
    workspaceId,
    currentConversation,
) {

    const [files, setFiles] = useState([]);

    const [uploading, setUploading] =
        useState(false);

    async function uploadFile(file) {

        console.log("📎 Upload started");
        console.log("Selected file:", file);
        console.log("Workspace ID:", workspaceId);
        console.log("Conversation ID:", currentConversation?.id);

        if (!workspaceId) {

            console.error("❌ No workspace ID found.");

            return;

        }

        setUploading(true);

        try {

            const uploadedFile =
                await filesAPI.uploadFile(

                    file,

                    workspaceId,

                    currentConversation?.id,

                );

            console.log(
                "✅ Backend returned:",
                uploadedFile
            );

            setFiles(prev => [

                ...prev,

                uploadedFile,

            ]);

            return uploadedFile;

        } catch (err) {

            console.error(
                "❌ Upload failed:",
                err
            );

        } finally {

            setUploading(false);

        }

    }

    function removeFile(fileId) {

        setFiles(prev =>

            prev.filter(

                file => file.id !== fileId

            )

        );

    }

    function clearFiles() {

        setFiles([]);

    }

    return {

        files,

        uploading,

        uploadFile,

        removeFile,

        clearFiles,

    };

}