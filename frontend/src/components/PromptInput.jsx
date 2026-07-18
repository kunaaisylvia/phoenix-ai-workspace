export default function PromptInput() {
    return (
        <div className="border-t border-gray-800 p-6">

            <div className="flex gap-4">

                <input
                    type="text"
                    placeholder="Ask Phoenix anything..."
                    className="flex-1 rounded-xl bg-[#1D2948] px-5 py-4 outline-none focus:ring-2 focus:ring-orange-500"
                />

                <button
                    className="rounded-xl bg-orange-500 px-8 font-semibold hover:bg-orange-600 transition"
                >
                    Send
                </button>

            </div>

        </div>
    );
}