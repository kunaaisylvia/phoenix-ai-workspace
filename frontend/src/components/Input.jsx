export default function Input(props) {
  return (
    <input
      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-orange-500"
      {...props}
    />
  );
}