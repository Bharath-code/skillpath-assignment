import React from "react"
import HeroSection from "./components/HeroSection"
import SkillpathCourses from "./components/SkillpathCourses"
import FooterSection from "./components/FooterSection"
import { Asterisk, Activity } from "lucide-react"

export function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-[#f4f4f0] selection:bg-[#ccff00] selection:text-black">
      {/* Swiss Editorial Tactical Header */}
      <header className="sticky top-0 z-50 bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/10 font-mono">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#ccff00] text-black flex items-center justify-center font-bold text-xs">
              <Asterisk className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-normal tracking-tight text-white">Skillpath</span>
              <span className="text-[10px] text-[#ccff00] bg-[#ccff00]/10 px-1.5 py-0.5 border border-[#ccff00]/30 font-mono">
                v2.0
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-xs uppercase font-mono tracking-wider">
            <a href="#courses" className="text-slate-300 hover:text-[#ccff00] transition-colors flex items-center gap-1.5">
              <span>[ CATALOG ]</span>
            </a>
            <a href="#about" className="hidden sm:flex text-slate-400 hover:text-white transition-colors items-center gap-1.5">
              <span>[ PLATFORM ]</span>
            </a>
          </nav>

          {/* Live Sync Status Pill */}
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-slate-400 border border-white/10 px-2.5 py-1 bg-[#12141c]">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span className="hidden sm:inline text-slate-300">API:</span>
            <span className="text-[#ccff00]">LIVE_SYNC</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Courses Section (Dynamic API Component) */}
      <div id="courses" className="scroll-mt-20 flex-1">
        <SkillpathCourses accentColor="#ccff00" showRefundableBadge={true} />
      </div>

      {/* Footer Section */}
      <FooterSection />
    </div>
  )
}

export default App
