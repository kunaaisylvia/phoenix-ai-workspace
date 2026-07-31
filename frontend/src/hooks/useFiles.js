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

        if (!workspaceId) return;

        setUploading(true);

        try {

            const uploadedFile =
                await filesAPI.uploadFile(

                    file,

                    workspaceId,

                    currentConversation?.id,

                );

            setFiles(prev => [

                ...prev,

                uploadedFile,

            ]);

            return uploadedFile;

        } catch (err) {

            console.error(err);

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