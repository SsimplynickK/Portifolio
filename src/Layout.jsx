import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Terminal, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "home", page: "Home" },
  { label: "projects", page: "Projects" },
  { label: "blog", page: "Blog" },
];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  const isAdmin = currentPageName === "Admin";

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (isAdmin) {
    return <div className="min-h-screen bg-[#0a0a0a]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] scanlines">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00ff41]" />
            <span className="text-[#00ff41] font-semibold text-sm tracking-wider">
              szczesny<span className="text-[#00ff41]/40">.co.uk</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`px-3 py-1.5 text-xs tracking-wider transition-all rounded ${
                  currentPageName === item.page
                    ? "text-[#00ff41] bg-[#00ff41]/10"
                    : "text-[#606060] hover:text-[#00ff41]/70"
                }`}
              >
                /{item.label}
              </Link>
            ))}
            <span className="ml-4 text-[#2a2a2a] text-[10px] tabular-nums select-none">
              {time.toLocaleTimeString("en-GB", { hour12: false })}
            </span>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden text-[#00ff41] p-1"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="sm:hidden border-t border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-xs tracking-wider rounded ${
                  currentPageName === item.page
                    ? "text-[#00ff41] bg-[#00ff41]/10"
                    : "text-[#606060]"
                }`}
              >
                /{item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="pt-14 min-h-screen">{children}</main>

      <footer className="border-t border-[#1a1a1a] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#2a2a2a]">
          <span>© {new Date().getFullYear()} nicholas szczesny</span>
          <Link to={createPageUrl("Admin")} className="hover:text-[#444] transition-colors">
            admin
          </Link>
        </div>
      </footer>
    </div>
  );
}