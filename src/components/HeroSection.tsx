import React from "react"
import { ArrowUpRight, Asterisk } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 border-b border-white/10 bg-[#0b0c10]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Monospace System Header */}
        <div className="flex items-center gap-3 font-mono text-xs text-[#ccff00] uppercase tracking-wider mb-8">
          <Asterisk className="w-4 h-4 animate-spin-slow text-[#ccff00]" />
          <span>SKILLPATH SYSTEM // REPO_2026</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">CURATED LEARNING INDEX</span>
        </div>

        {/* Editorial Serif Display Headline */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal text-white tracking-tight leading-[0.95] mb-8">
          Master High-Impact Skills <br className="hidden sm:inline" />
          <em className="font-serif italic text-[#ccff00] font-normal">Without the Noise.</em>
        </h1>

        {/* Subtitle */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-4 border-t border-white/10">
          <p className="md:col-span-8 text-slate-300 text-base sm:text-lg font-sans leading-relaxed">
            Actionable, system-driven courses built for creators and operators who value raw execution over passive consumption.
          </p>

          <div className="md:col-span-4 flex md:justify-end">
            <a
              href="#courses"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#ccff00] text-black font-mono text-xs uppercase font-bold tracking-wider rounded-none border border-[#ccff00] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[6px_6px_0px_0px_#ffffff] hover:bg-white hover:border-white transition-all transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>Explore Catalog</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
