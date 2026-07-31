export default function FileChip({

    file,

    onRemove,

}) {

    function getIcon() {

        if (
            file.content_type?.startsWith("image/")
        ) {

            return "🖼️";

        }

        if (
            file.content_type?.includes("pdf")
        ) {

            return "📄";

        }

        if (
            file.content_type?.includes("word")
        ) {

            return "📝";

        }

        if (
            file.content_type?.includes("csv")
        ) {

            return "📊";

        }

        return "📁";

    }

    return (

        <div
            className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-[#1D2948]
                px-4
                py-2
            "
        >

            <span>

                {getIcon()}

            </span>

            <span
                className="
                    max-w-[220px]
                    truncate
                "
            >

                {file.original_name}

            </span>

            <button

                onClick={() =>
                    onRemove(file.id)
                }

                className="
                    text-red-400
                    hover:text-red-500
                "

            >

                ✕

            </button>

        </div>

    );

}