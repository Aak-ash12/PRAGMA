export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-32 py-12 text-center text-gray-500 text-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-poppins font-bold text-gray-300 text-lg">PRAGMA</span>
        </div>
        <p>&copy; 2026 PRAGMA Enterprise. Predictive Risk Analysis & Governance Management Assistant.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Documentation</a>
        </div>
      </div>
    </footer>
  );
}
