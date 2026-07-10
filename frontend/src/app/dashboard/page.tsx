"use client";

import Link from "next/link";

import { useState, useRef, useEffect, useCallback } from "react";
import { mediaHandler } from "@/services/mediaprocessor";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/* ═══════════════════════════════════════════════════════
   Streamweaver Dashboard
   Sidebar + Media Workspace + Recharts + Job Ledger
   ═══════════════════════════════════════════════════════ */

/* ─── Chart data ─── */
const latencyData = [
  { time: "T-60s", value: 20 },
  { time: "T-55s", value: 25 },
  { time: "T-50s", value: 15 },
  { time: "T-45s", value: 40 },
  { time: "T-40s", value: 35 },
  { time: "T-35s", value: 60 },
  { time: "T-30s", value: 55 },
  { time: "T-25s", value: 80 },
  { time: "T-20s", value: 70 },
  { time: "T-15s", value: 90 },
  { time: "NOW", value: 85 },
];

const throughputData = [
  { time: "T-60s", value: 100 },
  { time: "T-50s", value: 200 },
  { time: "T-40s", value: 150 },
  { time: "T-30s", value: 500 },
  { time: "T-20s", value: 450 },
  { time: "T-15s", value: 700 },
  { time: "T-10s", value: 650 },
  { time: "NOW", value: 900 },
];

/* ─── Job ledger data ─── */
const jobs = [
  {
    id: "SW-881",
    source: "S3-BUCKET-01",
    status: "[QUEUE_INGEST]",
    action: null,
  },
  {
    id: "SW-882",
    source: "LOCAL-PAYLOAD",
    status: "[WORKER_ACTIVE: CHUNKING]",
    action: null,
  },
  {
    id: "SW-883",
    source: "CLOUDINARY-UP",
    status: "[AES_ENCRYPTING]",
    action: null,
  },
  {
    id: "SW-884",
    source: "CDN-RELAY-04",
    status: "[SUCCESS: R2_STORED]",
    action: "Download Package (.zip)",
  },
];

/* ─── Sidebar nav items ─── */
const navItems = [
  { icon: "dashboard", label: "Dashboard", active: true },
  { icon: "dataset", label: "Infrastructure", active: false },
  { icon: "account_tree", label: "Pipelines", active: false },
  { icon: "analytics", label: "Logs", active: false },
  { icon: "key", label: "API Keys", active: false },
];

export default function DashboardPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [showStream, setShowStream] = useState(true);
  const [status, setStatus] = useState<'idle' | 'preview' | 'uploading' | 'processing' | 'error'>('idle');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chunkSize, setChunkSize] = useState('6s');
  const [resolution, setResolution] = useState('1080p');
  const [logs, setLogs] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom when new entries arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = useCallback((message: string) => {
    const now = new Date();
    const ts = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, `${ts} ${message}`]);
  }, []);

  const handleNewStream = () => {
    setShowStream(true);
    setStatus('idle');
    setVideoSrc(null);
    setSelectedFile(null);
    setErrorMessage(null);
    setLogs([]);
    setUploadProgress(0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 0) {
      setSelectedFile(file);
      setVideoSrc(URL.createObjectURL(file));
      setStatus('preview');
      setErrorMessage(null);
    }
  };

  const handleStartProcessing = async () => {
    if (!selectedFile) return;

    setStatus('uploading');
    setLogs([]);
    setUploadProgress(0);

    try {
      const token = await getToken();
      if (!token) {
        addLog('[ERROR] Authentication token not found. Redirecting to sign-in...');
        router.push("/sign-in");
        return;
      }

      addLog('[SYS] Authentication verified. Starting pipeline...');

      const formData = new FormData();
      formData.append('mediaFile', selectedFile);
      formData.append('chunkSize', chunkSize);
      formData.append('resolution', resolution);

      const response = await mediaHandler(formData, token, {
        onLog: addLog,
        onProgress: setUploadProgress,
      });

      if (!response) {
        throw new Error("Failed to process file");
      }
      setStatus('processing');
    } catch (error) {
      console.error("Processing error:", error);
      const msg = error instanceof Error ? error.message : "An unexpected error occurred";
      addLog(`[ERROR] Pipeline failed: ${msg}`);
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#FAFAFA] rounded-none shadow-none">
      {/* ─── Sidebar ─── */}
      <aside className={`bg-[#FAFAFA] h-full shrink-0 z-30 transition-all duration-300 rounded-none shadow-none ${isSidebarOpen ? 'w-64 border-r border-gray-200' : 'w-0 overflow-hidden'}`}>
        <div className="w-64 h-full flex flex-col py-12 rounded-none shadow-none">
          <div className="px-4 mb-12 rounded-none shadow-none">
            <Link href="/" className="font-serif text-xl text-black block rounded-none shadow-none">
              Streamweaver
            </Link>
            <div className="mt-6 rounded-none shadow-none">
              <p className="font-mono text-xs text-black font-bold uppercase rounded-none shadow-none">
                Project Alpha
              </p>
              <p className="font-mono text-xs text-gray-500 mt-1 uppercase rounded-none shadow-none">
                V-INFRA-NODE-01
              </p>
            </div>
          </div>

          <nav className="flex-1 px-2 space-y-2 rounded-none shadow-none">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`flex items-center gap-4 px-4 py-2 font-mono text-xs uppercase rounded-none shadow-none ${
                  item.active
                    ? "text-black border-l border-gray-200"
                    : "text-gray-500"
                }`}
              >
                <span className="rounded-none shadow-none">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="px-4 mt-auto space-y-2 rounded-none shadow-none">
            <button 
              onClick={handleNewStream}
              className="w-full text-left font-mono text-xs text-gray-500 hover:text-black uppercase px-4 py-2 rounded-none shadow-none border-none bg-transparent cursor-pointer transition-colors"
            >
              NEW STREAM
            </button>
            <div className="border-t border-gray-200 pt-2 mt-4 space-y-2 rounded-none shadow-none">
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-1 font-mono text-xs text-gray-500 hover:text-black uppercase rounded-none shadow-none transition-colors"
              >
                <span className="rounded-none shadow-none">DOCUMENTATION</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-1 font-mono text-xs text-gray-500 hover:text-black uppercase rounded-none shadow-none transition-colors"
              >
                <span className="rounded-none shadow-none">SUPPORT</span>
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col h-full relative rounded-none shadow-none bg-[#FAFAFA]">
        {/* Header */}
        <header className="bg-[#FAFAFA] w-full border-b border-gray-200 flex justify-between items-center px-4 py-4 shrink-0 z-10 rounded-none shadow-none">
          <div className="flex items-center gap-3 rounded-none shadow-none">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-black p-1 rounded-none shadow-none bg-transparent border-none cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
            <h1 className="font-serif text-xl text-black rounded-none shadow-none">
              Streamweaver
            </h1>
          </div>
          <div className="flex gap-4 rounded-none shadow-none">
            <button className="text-black p-1 hidden sm:block rounded-none shadow-none bg-transparent border-none cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </button>
            <button className="text-black p-1 rounded-none shadow-none bg-transparent border-none cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <button className="text-black p-1 rounded-none shadow-none bg-transparent border-none cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </button>
          </div>
        </header>

        {/* ─── Horizontal Split Layout ─── */}
        <div className="flex-1 flex flex-col rounded-none shadow-none min-h-0">
          {/* Top Half: Media Workspace */}
          <div className="flex-[3] relative border-b border-gray-200 flex bg-[#FAFAFA] rounded-none shadow-none min-h-0">
            <div className="absolute top-4 left-4 z-10 rounded-none shadow-none pointer-events-none">
              <span className="font-mono text-xs text-gray-500 uppercase rounded-none shadow-none">
                WORKSPACE // MEDIA_WORKBENCH_01
              </span>
            </div>
            
            <div className={`h-full flex flex-col items-center p-6 pt-10 transition-all duration-500 rounded-none shadow-none overflow-y-auto ${(status === 'uploading' || status === 'processing') ? 'w-2/3' : 'w-full'}`}>
              {showStream && (
                <div className="w-full max-w-4xl flex flex-col gap-4 shrink-0">
                  <div className="relative w-full aspect-video bg-[#FAFAFA] flex flex-col items-center justify-center overflow-hidden rounded-none shadow-none border-none shrink-0">
                  
                  {status === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center border border-dashed border-gray-200 bg-transparent z-20 rounded-none shadow-none">
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer rounded-none shadow-none">
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="video/*" 
                          onChange={handleFileSelect}
                        />
                        <h2 className="font-serif text-xl text-black rounded-none shadow-none">INGEST RAW MEDIA</h2>
                      </label>
                    </div>
                  )}

                  {(status === 'preview' || status === 'uploading' || status === 'processing' || status === 'error') && (
                    <div className="absolute inset-0 z-10 bg-transparent border-none rounded-none shadow-none">
                      {videoSrc && (
                        <video src={videoSrc} className="w-full h-full object-cover border-none rounded-none shadow-none bg-black" autoPlay muted loop playsInline />
                      )}
                      
                      {status === 'uploading' && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-none shadow-none">
                          <div className="font-mono text-xs text-black uppercase rounded-none shadow-none">
                            UPLINKING_RAW_PAYLOAD...
                          </div>
                        </div>
                      )}

                      {status === 'processing' && (
                         <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-none shadow-none">
                          <div className="font-mono text-xs text-black uppercase rounded-none shadow-none">
                            ENGINE_PROCESSING_ACTIVE
                          </div>
                        </div>
                      )}

                      {status === 'error' && (
                        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-4 z-20 border border-gray-200 rounded-none shadow-none">
                          <div className="font-mono text-xs text-black text-center max-w-sm px-4 uppercase rounded-none shadow-none">
                            PROCESSING_ERROR: {errorMessage}
                          </div>
                          <div className="flex gap-3 mt-2 rounded-none shadow-none">
                            <button
                              onClick={handleStartProcessing}
                              className="bg-black text-white font-mono text-xs uppercase px-4 py-2 border-none rounded-none shadow-none cursor-pointer"
                            >
                              RETRY
                            </button>
                            <button
                              onClick={handleNewStream}
                              className="bg-white text-black font-mono text-xs uppercase px-4 py-2 border border-gray-200 rounded-none shadow-none cursor-pointer"
                            >
                              NEW STREAM
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Configuration Panel & Trigger */}
                {(status === 'preview' || status === 'uploading' || status === 'processing' || status === 'error') && (
                  <div className="w-full border border-gray-200 bg-white flex flex-col rounded-none shadow-none">
                    <div className="p-4 border-b border-gray-200 flex justify-between gap-6">
                      <div className="flex-1 flex flex-col">
                        <label className="font-mono text-[10px] text-gray-500 uppercase mb-2">HLS Chunk Length</label>
                        <select 
                          value={chunkSize}
                          onChange={(e) => setChunkSize(e.target.value)}
                          disabled={status !== 'preview'}
                          className="bg-transparent border-b border-gray-300 font-mono text-xs p-1 rounded-none outline-none disabled:opacity-50"
                        >
                          <option value="2s">2 seconds</option>
                          <option value="4s">4 seconds</option>
                          <option value="6s">6 seconds</option>
                          <option value="10s">10 seconds</option>
                        </select>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <label className="font-mono text-[10px] text-gray-500 uppercase mb-2">Resolution / Bitrate</label>
                        <select 
                          value={resolution}
                          onChange={(e) => setResolution(e.target.value)}
                          disabled={status !== 'preview'}
                          className="bg-transparent border-b border-gray-300 font-mono text-xs p-1 rounded-none outline-none disabled:opacity-50"
                        >
                          <option value="1080p">1080p (6000kbps)</option>
                          <option value="720p">720p (3000kbps)</option>
                          <option value="480p">480p (1500kbps)</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-4">
                      <button
                        onClick={handleStartProcessing}
                        disabled={status !== 'preview'}
                        className={`w-full py-2 font-mono text-xs uppercase tracking-widest rounded-none shadow-none transition-colors border-none ${status === 'preview' ? 'bg-black text-white cursor-pointer' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                      >
                        {status === 'preview' ? 'INITIALIZE ENGINE PIPELINE' : 'PROCESSING...'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
              )}
            </div>

            {/* Sliding Ledger Side Panel */}
            <div className={`h-full bg-white transition-all duration-500 overflow-hidden flex flex-col rounded-none shadow-none ${(status === 'uploading' || status === 'processing') ? 'w-1/3 opacity-100 border-l border-gray-200' : 'w-0 opacity-0 border-none'}`}>
               <div className="p-4 border-b border-gray-200 shrink-0 rounded-none shadow-none bg-white">
                 <div className="flex justify-between items-center">
                   <span className="font-serif text-xl uppercase text-black rounded-none shadow-none">LOGS</span>
                   <span className="font-mono text-xs text-gray-500">{logs.length} entries</span>
                 </div>
                 {/* Upload progress bar */}
                 {status === 'uploading' && (
                   <div className="mt-3">
                     <div className="flex justify-between items-center mb-1">
                       <span className="font-mono text-[10px] text-gray-500 uppercase">Upload Progress</span>
                       <span className="font-mono text-[10px] text-black font-bold">{uploadProgress}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-gray-200 rounded-none overflow-hidden">
                       <div
                         className="h-full bg-black transition-all duration-300 ease-out"
                         style={{ width: `${uploadProgress}%` }}
                       />
                     </div>
                   </div>
                 )}
               </div>
               <ul className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 bg-white list-none m-0 text-black rounded-none shadow-none">
                 {logs.length === 0 && (
                   <li className="text-gray-400 italic">Waiting for pipeline events...</li>
                 )}
                 {logs.map((entry, idx) => (
                   <li
                     key={idx}
                     className={`py-0.5 ${
                       entry.includes('[ERROR]')
                         ? 'text-red-600 font-bold'
                         : entry.includes('[CHUNK]')
                         ? 'text-gray-600'
                         : entry.includes('[BUCKET]') || entry.includes('[JOB]')
                         ? 'text-black font-medium'
                         : 'text-gray-800'
                     }`}
                   >
                     {entry}
                   </li>
                 ))}
                 <div ref={logsEndRef} />
               </ul>
            </div>
          </div>

          {/* Bottom Half: Performance Monitoring */}
          <div className="flex-[2] flex flex-col lg:flex-row rounded-none shadow-none bg-white min-h-0 overflow-hidden">
            {/* Chart 1: Pipeline Latency */}
            <div className="flex-1 border-r border-gray-200 flex flex-col p-6 relative rounded-none shadow-none bg-white">
              <div className="flex justify-between items-center mb-6 rounded-none shadow-none">
                <span className="font-serif text-xl text-black uppercase rounded-none shadow-none">
                  Pipeline Latency (ms)
                </span>
                <div className="flex items-center gap-2 rounded-none shadow-none">
                  <span className="font-mono text-xs text-black uppercase rounded-none shadow-none">LIVE</span>
                </div>
              </div>
              <div className="flex-1 min-h-[250px] rounded-none shadow-none bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyData}>
                    <XAxis
                      dataKey="time"
                      tick={{
                        fontFamily: "monospace",
                        fontSize: 10,
                        fill: "#9CA3AF",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 120]}
                      ticks={[0, 40, 80, 120]}
                      tick={{
                        fontFamily: "monospace",
                        fontSize: 10,
                        fill: "#9CA3AF",
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={35}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#000000"
                      strokeWidth={1}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Throughput */}
            <div className="flex-1 border-r border-gray-200 flex flex-col p-6 relative rounded-none shadow-none bg-white">
              <div className="flex justify-between items-center mb-6 rounded-none shadow-none">
                <span className="font-serif text-xl text-black uppercase rounded-none shadow-none">
                  Throughput (MB/s)
                </span>
                <div className="flex items-center gap-2 rounded-none shadow-none">
                  <span className="font-mono text-xs text-black uppercase rounded-none shadow-none">LIVE</span>
                </div>
              </div>
              <div className="flex-1 min-h-[250px] rounded-none shadow-none bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={throughputData}>
                    <XAxis
                      dataKey="time"
                      tick={{
                        fontFamily: "monospace",
                        fontSize: 10,
                        fill: "#9CA3AF",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 1000]}
                      ticks={[0, 500, 750, 1000]}
                      tick={{
                        fontFamily: "monospace",
                        fontSize: 10,
                        fill: "#9CA3AF",
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={35}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#000000"
                      strokeWidth={1}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section 3: Job Ledger */}
            <div className="flex-1 flex flex-col p-6 relative rounded-none shadow-none bg-white">
              <div className="flex justify-between items-center mb-6 rounded-none shadow-none">
                <span className="font-serif text-xl text-black uppercase rounded-none shadow-none">
                  Asynchronous Job Ledger
                </span>
              </div>
              <div className="flex-1 overflow-auto rounded-none shadow-none bg-white">
                <table className="w-full text-left border-collapse rounded-none shadow-none bg-white">
                  <thead className="border-b border-black rounded-none shadow-none">
                    <tr>
                      <th className="py-2 font-mono text-xs font-bold text-black uppercase rounded-none shadow-none">
                        Job ID
                      </th>
                      <th className="py-2 font-mono text-xs font-bold text-black uppercase rounded-none shadow-none">
                        Source
                      </th>
                      <th className="py-2 font-mono text-xs font-bold text-black uppercase rounded-none shadow-none">
                        Engine Status
                      </th>
                      <th className="py-2 font-mono text-xs font-bold text-black uppercase rounded-none shadow-none">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="rounded-none shadow-none">
                    {jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="border-b border-gray-200 rounded-none shadow-none"
                      >
                        <td className="py-3 font-mono text-xs text-black rounded-none shadow-none">{job.id}</td>
                        <td className="py-3 font-mono text-xs text-black rounded-none shadow-none">{job.source}</td>
                        <td className="py-3 font-mono text-xs text-black uppercase rounded-none shadow-none">
                          {job.status.replace(/\[|\]/g, '')}
                        </td>
                        <td className="py-3 font-mono text-xs text-black rounded-none shadow-none">
                          {job.action ? (
                            <button className="font-mono text-xs text-black uppercase underline border-none bg-transparent rounded-none shadow-none cursor-pointer p-0">
                              {job.action}
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
