import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  return (
    <AuthLayout>

      <h2 className="text-2xl font-semibold mb-6">
        Create your account
      </h2>

      <form className="space-y-5">

        <input
          placeholder="Full Name"
          className="w-full rounded-xl bg-[#1A2544] p-4 outline-none"
        />

        <input
          placeholder="Email"
          className="w-full rounded-xl bg-[#1A2544] p-4 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl bg-[#1A2544] p-4 outline-none"
        />

        <button
          className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl p-4 font-semibold transition"
        >
          Register
        </button>

      </form>

      <p className="text-center mt-6 text-gray-400">

        Already have an account?

        <Link
          to="/login"
          className="text-orange-500 ml-2"
        >
          Login
        </Link>

      </p>

    </AuthLayout>
  );
}