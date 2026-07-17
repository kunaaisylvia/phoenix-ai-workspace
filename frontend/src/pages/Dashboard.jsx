import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-[#070B1A] text-white p-10">

            <div className="flex items-center justify-between">

                <h1 className="text-4xl font-bold text-orange-500">
                    🔥 Phoenix Dashboard
                </h1>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-semibold transition"
                >
                    Logout
                </button>

            </div>

            <div className="mt-12 bg-[#121A31] rounded-2xl p-8">

                <h2 className="text-2xl font-semibold mb-4">
                    Welcome to Phoenix
                </h2>

                <p className="text-gray-400">
                    Authentication is working successfully.
                </p>

            </div>

        </div>
    );
}

export default Dashboard;