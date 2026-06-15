"use client";

import Link from "next/link";
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
          <button className="w-full bg-primary text-on-primary font-code-md py-2 border border-primary hover:bg-transparent hover:text-primary transition-colors">
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
          <div className="flex-1 relative border-b border-[#E5E7EB]">
            <div className="absolute inset-0 grid-pattern opacity-30"></div>
            <div className="absolute top-4 left-4 z-10">
              <span className="tiny-mono tracking-widest uppercase">
                Workspace // Media_Workbench_01
              </span>
            </div>
            <div className="relative w-full h-full flex items-center justify-center p-6">
              <div className="relative w-full max-w-4xl aspect-video bg-surface-container-lowest border border-outline-variant flex flex-col items-center justify-center overflow-hidden">
                {/* Dropzone */}
                <div
                  id="media-dropzone"
                  className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant bg-surface-container-lowest transition-opacity duration-150"
                >
                  <h2 className="font-headline-md text-primary mb-1">
                    Ingest raw media payload
                  </h2>
                  <p className="tiny-mono">Awaiting Cloudinary uplink...</p>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant">
                  <div className="h-full bg-primary w-1/3 transition-all duration-500"></div>
                </div>
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
