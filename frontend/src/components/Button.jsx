export default function Button({
  children,
  ...props
}) {
  return (
    <button
      className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
      {...props}
    >
      {children}
    </button>
  );
}