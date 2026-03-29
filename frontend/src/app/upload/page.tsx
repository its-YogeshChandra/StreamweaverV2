"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';

const svgPaths = {
  pefc0a30: "M139.5 0.5V44.5H4.5V0.5H139.5Z",
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [resolution, setResolution] = useState("1080p");
  const [chunkLength, setChunkLength] = useState(4);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        handleFileSelect(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resolutions = ["4K", "1080p", "720p", "480p", "360p"];

  return (
    <div className="flex flex-col min-h-screen items-center w-full bg-black text-white selection:bg-[#F25FAD] selection:text-white">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight hover:text-gray-300 transition-colors">
            sweaver
          </Link>

          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            <span className="text-sm lg:text-base font-medium text-[#F25FAD]">
              {"// workstation"}
            </span>
          </nav>

          <Link href="/">
            <button className="relative group cursor-pointer transition-transform hover:scale-105 active:scale-95">
              <svg 
                className="w-[90px] h-[36px] sm:w-[110px] sm:h-[42px] drop-shadow-lg opacity-80 group-hover:opacity-100" 
                fill="none" 
                preserveAspectRatio="none" 
                viewBox="0 0 144 53"
              >
                <g filter="url(#glow-home)">
                  <path d="M4 0H140V45H4V0Z" fill="transparent" stroke="#555" strokeWidth="2" className="group-hover:stroke-gray-300 transition-colors duration-300" />
                </g>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-medium text-gray-400 group-hover:text-white text-sm sm:text-base pointer-events-none transition-colors">
                back
              </span>
            </button>
          </Link>
        </div>
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#444] to-transparent mt-8 lg:mt-10 opacity-70" />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col items-center">
        
        {/* Title */}
        <div className="mb-8 text-center w-full">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Upload & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F25FAD] to-purple-500">Transcode</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-light">
            Drop your video payload here to initiate the processing sequence.
          </p>
        </div>

        {!file ? (
          /* Dropzone */
          <div 
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full max-w-3xl aspect-video sm:aspect-[2/1] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group
              ${isDragging ? 'border-[#F25FAD] bg-[#F25FAD]/10 scale-[1.02]' : 'border-gray-700 bg-gray-900/50 hover:border-gray-500 hover:bg-gray-800/80'}
            `}
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
            
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-[#F25FAD]/20 group-hover:border-[#F25FAD]/50 transition-all duration-300 mb-6 group-hover:scale-110 ${isDragging ? "bg-[#F25FAD]/20 border-[#F25FAD]/50 scale-110" : ""}`}>
              <svg className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-300 ${isDragging ? 'text-[#F25FAD]' : 'text-gray-400 group-hover:text-[#F25FAD]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-200">
              {isDragging ? 'Drop video now' : 'Select a video'}
            </h3>
            <p className="text-sm text-gray-400 font-light">
              or drag and drop it here
            </p>
            <p className="text-xs text-gray-500 mt-4 font-mono">MP4, MOV, WEBM up to 10GB</p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="video/*" 
              className="hidden" 
            />
          </div>
        ) : (
          /* Preview and Settings */
          <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Player Container */}
            <div className="w-full rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-2xl shadow-black/50 overflow-hidden relative flex flex-col group transition-all hover:border-gray-700">
              
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  <span className="font-mono text-sm text-gray-300 truncate max-w-[200px] sm:max-w-md">
                    {file.name}
                  </span>
                </div>
                <button 
                  onClick={() => { setFile(null); setPreviewUrl(null); }}
                  className="text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full hover:bg-[#F25FAD]/20 hover:text-[#F25FAD] border border-transparent hover:border-[#F25FAD]/30"
                >
                  Remove Focus
                </button>
              </div>

              {previewUrl && (
                <video 
                  src={previewUrl} 
                  controls 
                  className="w-full max-h-[50vh] object-contain bg-black/80"
                />
              )}
            </div>

            {/* Configuration Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
              
              {/* Resolutions */}
              <div className="col-span-1 lg:col-span-7 flex flex-col rounded-2xl bg-gray-900/40 border border-gray-800/80 p-6 backdrop-blur-sm shadow-xl transition-all hover:border-gray-700">
                <div className="flex items-center gap-2 mb-6">
                  <svg className="w-5 h-5 text-[#F25FAD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-200">Target Resolution</h3>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {resolutions.map(res => (
                    <button
                      key={res}
                      onClick={() => setResolution(res)}
                      className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 border ${
                        resolution === res 
                          ? 'bg-gradient-to-r from-[#F25FAD] to-purple-500 text-white border-transparent shadow-[0_4px_15px_rgba(242,95,173,0.4)]' 
                          : 'bg-transparent text-gray-400 border-gray-700/80 hover:border-gray-500 hover:text-gray-200 hover:bg-gray-800'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chunk Length Slider */}
              <div className="col-span-1 lg:col-span-5 rounded-2xl bg-gray-900/40 border border-gray-800/80 p-6 backdrop-blur-sm shadow-xl transition-all hover:border-gray-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <svg className="w-5 h-5 text-[#F25FAD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-200">Chunk Length</h3>
                  </div>

                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-mono">HLS Segments</span>
                        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                          {chunkLength}s
                        </span>
                      </div>
                      <div className="text-[10px] text-[#F25FAD] font-mono border border-[#F25FAD]/30 bg-[#F25FAD]/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
                        Optimal
                      </div>
                    </div>
                    
                    <div className="relative w-full">
                      <input 
                        type="range" 
                        min="2" 
                        max="20" 
                        step="1"
                        value={chunkLength}
                        onChange={e => setChunkLength(Number(e.target.value))}
                        className="w-full appearance-none bg-transparent cursor-pointer 
                          [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-800 [&::-webkit-slider-runnable-track]:border [&::-webkit-slider-runnable-track]:border-gray-700/50 [&::-webkit-slider-runnable-track]:h-2 
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[#F25FAD] [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(242,95,173,0.5)] 
                          focus:outline-none hover:[&::-webkit-slider-thumb]:scale-110 transition-all duration-200"
                      />
                      <div className="flex justify-between w-full mt-3 text-xs text-gray-500 font-mono">
                        <span>2s</span>
                        <span>10s</span>
                        <span>20s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Area */}
            <div className="w-full flex justify-center sm:justify-end mt-4 lg:mt-6 mb-12">
              <button className="relative group cursor-pointer transition-transform hover:scale-[1.03] active:scale-[0.97]">
                <svg 
                  className="w-[160px] h-[50px] sm:w-[180px] sm:h-[55px] drop-shadow-lg" 
                  fill="none" 
                  preserveAspectRatio="none" 
                  viewBox="0 0 144 53"
                >
                  <g filter="url(#glow-submit)">
                    <path d="M4 0H140V45H4V0Z" fill="#F25FAD" className="hover:fill-[#ff7ac1] transition-colors duration-300" />
                    <path d={svgPaths.pefc0a30} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  </g>
                  <defs>
                    <filter 
                      id="glow-submit"
                      x="-20" y="-20" width="180" height="90"
                      filterUnits="userSpaceOnUse"
                    >
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#F25FAD" floodOpacity="0.4" />
                    </filter>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center gap-2 font-bold text-white text-base sm:text-lg pointer-events-none">
                  <span>Initialize</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </button>
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
}
