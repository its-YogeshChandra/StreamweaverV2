"use client";

import Link from "next/link";
import Form from "next/form";
import { useState, useEffect } from "react";
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
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing'>('idle');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleNewStream = () => {
    setShowStream(true);
    setStatus('idle');
    setVideoSrc(null);
    setUploadProgress(0);
  };

  const handleUploadAction = async (formData: FormData) => {
    const file = formData.get('mediaFile') as File;
    if (file && file.size > 0) {
      setVideoSrc(URL.createObjectURL(file));
      setStatus('uploading');

      //call the media handler
      const token = await getToken();
      if(!token){
        //redirect to the signin page 
        router.push("/sign-in");
        return;
      }
      const response = await mediaHandler(formData, token);
      if(!response){
        throw new Error("Failed to upload file");
      }
      setVideoSrc(response.video_url);
    }
  };

  useEffect(() => {
    if (status === 'uploading') {
      const interval = setInterval(() => {
        setUploadProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus('processing');
            return 100;
          }
          return p + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#FAFAFA]">
      {/* ─── Sidebar ─── */}
      <aside className="bg-surface-container-low h-full w-64 border-r border-outline-variant hidden md:flex flex-col py-12 shrink-0 z-10">
        <div className="px-4 mb-12">
          <Link href="/" className="font-headline-md text-primary block">
            Streamweaver
          </Link>
          <div className="mt-6">
            <p className="font-code-md text-primary font-bold">
              Project Alpha
            </p>
            <p className="font-label-caps text-on-surface-variant mt-1">
              V-INFRA-NODE-01
            </p>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-4 px-4 py-2 transition-all duration-75 ${
                item.active
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-code-md">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="px-4 mt-auto space-y-2">
          <button 
            onClick={handleNewStream}
            className="w-full bg-primary text-on-primary font-code-md py-2 border border-primary hover:bg-transparent hover:text-primary transition-colors"
          >
            New Stream
          </button>
          <div className="border-t border-outline-variant pt-2 mt-4 space-y-2">
            <a
              href="#"
              className="flex items-center gap-4 px-4 py-1 text-on-surface-variant hover:text-on-surface transition-all duration-75"
            >
              <span className="material-symbols-outlined text-[18px]">
                menu_book
              </span>
              <span className="font-code-md text-[12px]">Documentation</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-4 px-4 py-1 text-on-surface-variant hover:text-on-surface transition-all duration-75"
            >
              <span className="material-symbols-outlined text-[18px]">
                contact_support
              </span>
              <span className="font-code-md text-[12px]">Support</span>
            </a>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <header className="bg-surface w-full border-b border-outline-variant flex justify-between items-center px-4 py-4 md:hidden shrink-0 z-10">
          <h1 className="font-headline-md font-bold text-primary">
            Streamweaver
          </h1>
          <div className="flex gap-4">
            <button className="text-on-surface-variant hover:bg-surface-container transition-colors duration-150 p-1">
              <span className="material-symbols-outlined">terminal</span>
            </button>
            <button className="text-on-surface-variant hover:bg-surface-container transition-colors duration-150 p-1">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="text-on-surface-variant hover:bg-surface-container transition-colors duration-150 p-1">
              <span className="material-symbols-outlined">
                account_circle
              </span>
            </button>
          </div>
        </header>

        {/* Desktop Top Actions */}
        <div className="absolute top-0 right-0 p-4 hidden md:flex gap-4 z-20">
          <button className="text-on-surface-variant hover:bg-surface-container transition-colors duration-150 p-1">
            <span className="material-symbols-outlined">terminal</span>
          </button>
          <button className="text-on-surface-variant hover:bg-surface-container transition-colors duration-150 p-1">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="text-on-surface-variant hover:bg-surface-container transition-colors duration-150 p-1">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>

        {/* ─── Horizontal Split Layout ─── */}
        <div className="flex-1 flex flex-col">
          {/* Top Half: Media Workspace */}
          <div className="flex-1 relative border-b border-[#E5E7EB] flex overflow-hidden bg-[#FAFAFA]">
            <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none"></div>
            <div className="absolute top-4 left-4 z-10">
              <span className="font-mono text-[10px] tracking-widest uppercase">
                Workspace // Media_Workbench_01
              </span>
            </div>
            
            <div className={`relative h-full flex items-center justify-center p-6 transition-all duration-500 ${status === 'processing' ? 'w-2/3' : 'w-full'}`}>
              {showStream && (
                <div className="relative w-full max-w-4xl aspect-video border border-[#E5E7EB] bg-[#FAFAFA] flex flex-col items-center justify-center overflow-hidden">
                  
                  {status === 'idle' && (
                    <Form action={handleUploadAction} className="absolute inset-0 flex flex-col items-center justify-center border-dashed border-gray-300 bg-white hover:bg-gray-50 transition-colors z-20" style={{ borderWidth: '1px' }}>
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                        <input 
                          type="file" 
                          name="mediaFile" 
                          className="hidden" 
                          accept="video/*" 
                          onChange={(e) => {
                            if (e.target.form) e.target.form.requestSubmit();
                          }} 
                        />
                        <h2 className="font-serif text-xl text-primary">Ingest Raw Media</h2>
                      </label>
                    </Form>
                  )}

                  {(status === 'uploading' || status === 'processing') && (
                    <div className="absolute inset-0 z-10 bg-black">
                      {videoSrc && (
                        <video src={videoSrc} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                      )}
                      
                      {status === 'uploading' && (
                        <>
                          <div className="absolute bottom-0 left-0 h-px bg-black transition-all duration-100 ease-linear" style={{ width: `${uploadProgress}%` }}></div>
                          <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white bg-black/50 px-2 py-1">
                            UPLINKING_RAW_PAYLOAD...
                          </div>
                        </>
                      )}

                      {status === 'processing' && (
                        <>
                          <div className="absolute bottom-0 left-0 h-px bg-gray-500 w-full animate-pulse"></div>
                          <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white bg-black/50 px-2 py-1">
                            ENGINE_PROCESSING_ACTIVE
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sliding Ledger Side Panel */}
            <div className={`h-full bg-[#FAFAFA] border-l border-[#E5E7EB] transition-all duration-500 overflow-hidden flex flex-col ${status === 'processing' ? 'w-1/3 opacity-100' : 'w-0 opacity-0 border-l-0'}`}>
               <div className="p-4 border-b border-[#E5E7EB] shrink-0">
                 <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-primary">Active Background Ledger</span>
               </div>
               <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] space-y-2 bg-[#FAFAFA]">
                 <div className="text-gray-500">14:02:00 [SYS] Establishing worker node...</div>
                 <div className="text-gray-500">14:02:01 [SYS] Analyzing stream segments...</div>
                 <div className="text-gray-500">14:02:02 [SYS] Chunking media payload...</div>
                 <div className="text-gray-500">14:02:03 [SYS] Allocating memory pool...</div>
                 <div className="text-primary animate-pulse mt-4">ENGINE_PROCESSING_ACTIVE</div>
               </div>
            </div>
          </div>

          {/* Bottom Half: Performance Monitoring */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Chart 1: Pipeline Latency */}
            <div className="flex-1 border-r border-[#E5E7EB] flex flex-col p-6 relative">
              <div className="flex justify-between items-center mb-6">
                <span className="tiny-mono tracking-widest uppercase text-primary font-bold">
                  Pipeline Latency (ms)
                </span>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-primary"></span>
                  <span className="tiny-mono">LIVE</span>
                </div>
              </div>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E5E7EB"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      tick={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        fill: "#6B7280",
                      }}
                      axisLine={{ stroke: "#E5E7EB" }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 120]}
                      ticks={[0, 40, 80, 120]}
                      tick={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        fill: "#6B7280",
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={35}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1b1b1b",
                        border: "none",
                        borderRadius: "0px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "#ffffff",
                      }}
                      labelStyle={{ color: "#848484" }}
                      formatter={(value) => [
                        `${value}ms`,
                        "Latency",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#000000"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{
                        r: 4,
                        fill: "#000000",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Throughput */}
            <div className="flex-1 flex flex-col p-6 relative border-r border-[#E5E7EB]">
              <div className="flex justify-between items-center mb-6">
                <span className="tiny-mono tracking-widest uppercase text-primary font-bold">
                  Throughput (MB/s)
                </span>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-primary"></span>
                  <span className="tiny-mono">LIVE</span>
                </div>
              </div>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={throughputData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E5E7EB"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      tick={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        fill: "#6B7280",
                      }}
                      axisLine={{ stroke: "#E5E7EB" }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 1000]}
                      ticks={[0, 500, 750, 1000]}
                      tick={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        fill: "#6B7280",
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1b1b1b",
                        border: "none",
                        borderRadius: "0px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "#ffffff",
                      }}
                      labelStyle={{ color: "#848484" }}
                      formatter={(value) => [
                        `${value} MB/s`,
                        "Throughput",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#000000"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{
                        r: 4,
                        fill: "#000000",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section 3: Job Ledger */}
            <div className="flex-1 flex flex-col p-6 relative">
              <div className="flex justify-between items-center mb-6">
                <span className="tiny-mono tracking-widest uppercase text-primary font-bold">
                  Asynchronous Job Ledger
                </span>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="border-b border-[#E5E7EB]">
                    <tr>
                      <th className="py-1 font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">
                        Job ID
                      </th>
                      <th className="py-1 font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">
                        Source
                      </th>
                      <th className="py-1 font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">
                        Engine Status
                      </th>
                      <th className="py-1 font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="tiny-mono">
                    {jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="border-b border-[#E5E7EB]"
                      >
                        <td className="py-2">{job.id}</td>
                        <td className="py-2">{job.source}</td>
                        <td className="py-2 font-code-md">{job.status}</td>
                        <td className="py-2">
                          {job.action ? (
                            <button className="font-code-md text-[12px] text-primary underline">
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
