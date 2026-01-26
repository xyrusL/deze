"use client";

import { useState } from "react";

interface RedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
  siteName: string;
}

function RedirectModal({ isOpen, onClose, targetUrl, siteName }: RedirectModalProps) {
  if (!isOpen) return null;

  const handleRedirect = () => {
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-black/90 border border-white/20 rounded-2xl p-8 max-w-md w-full text-center relative">
        {/* Close X Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-gray-400 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>
        {/* Security Icon */}
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto" viewBox="0 0 64 64" fill="none">
            <rect x="16" y="24" width="32" height="28" rx="2" fill="#2ed573" />
            <rect x="24" y="12" width="16" height="16" rx="8" stroke="#2ed573" strokeWidth="4" fill="none" />
            <rect x="29" y="34" width="6" height="8" fill="#000" />
          </svg>
        </div>

        <h3 className="text-xl font-mono font-bold text-white mb-2">
          Leaving DEZE
        </h3>

        <p className="text-gray-400 text-sm font-mono mb-4">
          You&apos;re being redirected to <span className="text-cyan-400">{siteName}</span>
        </p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-mono">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1L1 4v4c0 4.4 3 7.5 7 8 4-0.5 7-3.6 7-8V4L8 1zm-1 11l-3-3 1-1 2 2 4-4 1 1-5 5z" />
            </svg>
            Verified DEZE subdomain
          </div>
          <p className="text-gray-500 text-xs mt-2 font-mono">
            This site is part of the DEZE network and is safe to visit.
          </p>
        </div>

        <button
          onClick={handleRedirect}
          className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-mono font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
        >
          Continue to {siteName}
        </button>

        {/* Fallback link */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-gray-600 text-xs font-mono mb-1">
            Button not working?
          </p>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400/60 hover:text-cyan-400 text-xs font-mono underline break-all cursor-pointer"
          >
            {targetUrl}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const currentYear = new Date().getFullYear();
  const [modal, setModal] = useState<{ isOpen: boolean; url: string; name: string }>({
    isOpen: false,
    url: "",
    name: "",
  });

  const openModal = (url: string, name: string) => {
    setModal({ isOpen: true, url, name });
  };

  const closeModal = () => {
    setModal({ isOpen: false, url: "", name: "" });
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 relative overflow-hidden"
      style={{
        backgroundColor: "#000",
        backgroundImage: "url('/assets/back.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Redirect Modal */}
      <RedirectModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        targetUrl={modal.url}
        siteName={modal.name}
      />

      {/* Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80 pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 text-center mb-12 sm:mb-16 animate-fade-in px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 font-mono animate-title">
          DEZE
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono">
          Gateway to the Future
        </p>
      </div>

      {/* Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl w-full animate-fade-in-delay-1 px-4">
        {/* Watermelon Card */}
        <button
          onClick={() => openModal("https://watermelon.deze.me", "Watermelon")}
          className="group p-5 sm:p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-400 hover:bg-black/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(0,243,255,0.3)] text-left cursor-pointer"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-3 font-mono text-white">
            Watermelon
            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <rect x="4" y="2" width="8" height="12" fill="#2ed573" rx="1" />
              <rect x="5" y="3" width="6" height="10" fill="#ff4757" />
              <rect x="7" y="5" width="1" height="1" fill="#000" />
              <rect x="8" y="7" width="1" height="1" fill="#000" />
              <rect x="6" y="9" width="1" height="1" fill="#000" />
            </svg>
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-mono break-words">
            A cozy Minecraft SMP server with custom plugins and endless adventures.
          </p>
        </button>

        {/* RioAnime Card */}
        <button
          onClick={() => openModal("https://rioanime.deze.me", "RioAnime")}
          className="group p-5 sm:p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400 hover:bg-black/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(188,19,254,0.3)] text-left cursor-pointer"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-3 font-mono text-white">
            RioAnime
            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="3" width="10" height="10" fill="#bc13fe" />
              <polygon points="6,5 6,11 11,8" fill="#fff" />
            </svg>
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-mono break-words">
            The ultimate destination for anime enthusiasts. Stream, discover, and enjoy.
          </p>
        </button>

        {/* Papa's Electronic Repair Shop Card */}
        <button
          onClick={() => openModal("https://papaselectronicrepairshop.deze.me", "Papa's Electronic Repair Shop")}
          className="group p-5 sm:p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-yellow-500/30 hover:border-yellow-400 hover:bg-black/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] text-left cursor-pointer"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-3 font-mono text-white">
            Papa&apos;s Repair
            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-mono break-words">
            Trusted electronics repair service since 2021. Quality you can trust.
          </p>
        </button>

        {/* Arcade Card */}
        <a
          href="/games"
          className="group p-5 sm:p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-green-500/30 hover:border-green-400 hover:bg-black/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(46,213,115,0.3)] sm:col-span-2 lg:col-span-1 cursor-pointer"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-3 font-mono text-white">
            Arcade
            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="4" width="12" height="8" rx="1" fill="#2ed573" />
              <rect x="4" y="6" width="3" height="4" fill="#000" />
              <circle cx="11" cy="7" r="1" fill="#ff4757" />
              <circle cx="11" cy="10" r="1" fill="#00f3ff" />
            </svg>
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-mono break-words">
            Play classic games. Test your skills.
          </p>
        </a>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-12 sm:mt-16 md:mt-20 text-center space-y-4 animate-fade-in-delay-2 px-4">
        <div className="text-xs sm:text-sm text-gray-300 font-mono max-w-lg mx-auto leading-loose">
          <p className="text-sm sm:text-base">Hey there! 👋 I&apos;m Jepot</p>
          <p className="mt-2 break-words">Just a dev exploring the web,</p>
          <p className="break-words">building fun projects &amp; learning cool tech</p>
          <p className="break-words">one line of code at a time 🤖✨</p>
          <p className="mt-3 text-cyan-400 font-semibold">Thanks for stopping by! 🚀</p>
        </div>
        <p className="text-xs text-gray-600 font-mono">© {currentYear} DEZE</p>
      </footer>
    </main>
  );
}
