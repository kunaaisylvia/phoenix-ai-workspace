export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#070B1A] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#121A31] rounded-3xl p-10 shadow-2xl border border-white/5">

        <div className="text-center mb-10">

          <h1 className="text-5xl mb-3">
            🔥
          </h1>

          <h2 className="text-4xl font-bold text-orange-500">
            Phoenix
          </h2>

          <p className="text-gray-400 mt-3">
            Build. Think. Create.
          </p>

        </div>

        {children}

      </div>
    </div>
  );
}