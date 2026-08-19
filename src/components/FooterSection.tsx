import React from "react"
import { Asterisk } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="w-full border-t border-white/10 py-12 bg-[#0b0c10] font-mono mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo & Copyright */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-[#ccff00] text-black flex items-center justify-center font-bold text-[10px]">
            <Asterisk className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif text-lg font-normal text-white">Skillpath</span>
          <span className="text-slate-500 text-xs">
            // © {new Date().getFullYear()} SKILLPATH_SYSTEMS. ALL_RIGHTS_RESERVED.
          </span>
        </div>

        {/* Three Links */}
        <div className="flex items-center gap-6 text-xs uppercase font-mono tracking-wider text-slate-400">
          <a href="#privacy" className="hover:text-[#ccff00] transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-[#ccff00] transition-colors">Terms of Service</a>
          <a href="#support" className="hover:text-[#ccff00] transition-colors">Support</a>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
