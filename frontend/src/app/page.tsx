import React from 'react';
import Link from 'next/link';

const svgPaths = {
  pefc0a30: "M139.5 0.5V44.5H4.5V0.5H139.5Z",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center w-full">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
            sweaver
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            <a href="#features" className="text-sm lg:text-base font-medium text-gray-300 hover:text-white transition-colors">
              features
            </a>
            <a href="#pricing" className="text-sm lg:text-base font-medium text-gray-300 hover:text-white transition-colors">
              pricing
            </a>
            <a href="#about" className="text-sm lg:text-base font-medium text-gray-300 hover:text-white transition-colors">
              about us
            </a>
          </nav>

          {/* CTA Button */}
          <Link href="/upload" className="relative group cursor-pointer transition-transform hover:scale-105 active:scale-95 block">
            <svg 
              className="w-[110px] h-[42px] sm:w-[136px] sm:h-[50px] drop-shadow-lg" 
              fill="none" 
              preserveAspectRatio="none" 
              viewBox="0 0 144 53"
            >
              <g filter="url(#glow)">
                <path d="M4 0H140V45H4V0Z" fill="#F25FAD" className="hover:fill-[#ff7ac1] transition-colors duration-300" />
                <path d={svgPaths.pefc0a30} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              </g>
              <defs>
                <filter 
                  id="glow"
                  x="-20" y="-20" width="180" height="90"
                  filterUnits="userSpaceOnUse"
                >
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#F25FAD" floodOpacity="0.4" />
                </filter>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-semibold text-white text-sm sm:text-base lg:text-lg pointer-events-none">
              onboard
            </span>
          </Link>
        </div>

        {/* Separator Line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#444] to-transparent mt-8 lg:mt-10 opacity-70" />
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden w-full px-4 py-4 flex justify-center gap-6 border-b border-[#222]">
        <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
          features
        </a>
        <a href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
          pricing
        </a>
        <a href="#about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
          about us
        </a>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col items-center justify-center text-center">
        {/* Presenting Tag */}
        <div className="inline-block px-4 py-1.5 rounded-full border border-gray-800 bg-gray-900/50 backdrop-blur-sm mb-8 hover:border-gray-700 transition-colors cursor-default">
          <p className="font-mono text-[#F25FAD] text-xs sm:text-sm font-medium tracking-widest uppercase">
            {"/* PRESENTING */"}
          </p>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-5 sm:mb-6 max-w-4xl tracking-tight leading-tight">
          One Stop <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">Video Transcoder</span>
        </h1>

        {/* Tagline */}
        <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-3xl mb-10 sm:mb-16 leading-relaxed font-light">
          We are building a scalable video-to-HLS transcoding engine that generates adaptive streaming assets, including custom-sized segments, metadata chapters, and seekbar sprites.
        </p>

        {/* Video/Image Placeholder */}
        <Link href="/upload" className="w-full max-w-5xl aspect-video rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-2xl overflow-hidden relative group cursor-pointer flex items-center justify-center transition-all hover:border-gray-700 hover:shadow-[#F25FAD]/10 hover:shadow-2xl block">
          {/* Animated background gradient inside placeholder */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          {/* Play button indicator */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </Link>
      </main>
    </div>
  );
}
