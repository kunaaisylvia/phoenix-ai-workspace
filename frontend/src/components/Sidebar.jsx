import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <aside className="w-72 bg-[#121A31] border-r border-gray-800 flex flex-col">

            <div className="p-6">

                <h1 className="text-3xl font-bold text-orange-500">
                    🔥 Phoenix
                </h1>

                <button
                    className="mt-8 w-full rounded-xl bg-orange-500 py-3 font-semibold hover:bg-orange-600 transition"
                >
                    + New Chat
                </button>

            </div>

            <div className="flex-1 px-6 overflow-y-auto">

                <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">
                    Today
                </p>

                <div className="space-y-2">

                    <button className="w-full rounded-lg bg-[#1D2948] px-4 py-3 text-left hover:bg-[#26365f] transition">
                        Build Phoenix Dashboard
                    </button>

                    <button className="w-full rounded-lg px-4 py-3 text-left hover:bg-[#1D2948] transition">
                        AI Workspace Ideas
                    </button>

                </div>

            </div>

            <div className="p-6">

                <button
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-gray-700 py-3 hover:bg-red-500 hover:border-red-500 transition"
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}