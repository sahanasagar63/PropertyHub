export default function AdminFooter() {
  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-6 py-6 text-center space-y-2">

        <h3 className="text-lg font-semibold">
          📞 Contact Admin
        </h3>

        <p className="text-green-400 font-semibold">
          +91 6363640030
        </p>

        <p className="text-sm text-slate-400">
          PropertyHub © {new Date().getFullYear()}
        </p>

      </div>
    </footer>
  );
}