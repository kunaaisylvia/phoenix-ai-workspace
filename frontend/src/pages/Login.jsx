import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);

        try {
            await login(email, password);

            navigate("/dashboard");
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#070B1A] flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-[#121A31] rounded-2xl shadow-2xl p-8">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-orange-500">
                        🔥 Phoenix
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Welcome back.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>
                        <label className="block mb-2 text-sm text-gray-300">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full rounded-xl bg-[#1D2948] border border-gray-700 px-4 py-3 text-white outline-none focus:border-orange-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-gray-300">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-xl bg-[#1D2948] border border-gray-700 px-4 py-3 text-white outline-none focus:border-orange-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 transition rounded-xl py-3 font-semibold disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>

                </form>

                <p className="text-center text-gray-400 mt-6">
                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="text-orange-500 hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}