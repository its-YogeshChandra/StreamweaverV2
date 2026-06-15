import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   Streamweaver Landing Page
   Merges Hero + Infrastructure + Pipeline sections into one
   continuous scrollable page with shared header & footer.
   ═══════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen flex flex-col relative dot-grid">
      {/* ─── Top Navigation ─── */}
      <header className="w-full z-50 bg-surface-container-lowest border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-margin-desktop py-4 mx-auto max-w-[1440px]">
          {/* Brand */}
          <Link
            href="/"
            className="font-headline-md tracking-tighter font-black text-primary"
          >
            STREAMWEAVER
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center">
            <a
              className="font-label-caps text-primary border-b-2 border-secondary font-bold py-1"
              href="#hero"
            >
              Streams
            </a>
            <a
              className="font-label-caps text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors duration-200 py-1 px-2 rounded-sm cursor-pointer"
              href="#pipelines"
            >
              Pipelines
            </a>
            <a
              className="font-label-caps text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors duration-200 py-1 px-2 rounded-sm cursor-pointer"
              href="#infrastructure"
            >
              Infrastructure
            </a>
            <a
              className="font-label-caps text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors duration-200 py-1 px-2 rounded-sm cursor-pointer"
              href="#logs"
            >
              Logs
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex gap-2">
              <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors duration-200 cursor-pointer text-primary">
                <span className="material-symbols-outlined">settings</span>
              </button>
              <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors duration-200 cursor-pointer text-primary">
                <span className="material-symbols-outlined">
                  account_circle
                </span>
              </button>
            </div>
            <Link
              href="/auth"
              className="bg-primary text-on-primary font-label-caps px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Deploy
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="flex-grow flex flex-col justify-center items-center px-4 md:px-10 py-20 relative z-10 w-full max-w-[1200px] mx-auto text-center"
      >
        {/* Hero Text */}
        <div className="max-w-4xl mx-auto space-y-6 mb-20">
          <h1 className="font-display-hero text-primary hidden md:block">
            Next-gen video infrastructure, handled.
          </h1>
          <h1 className="font-headline-lg-mobile text-primary block md:hidden">
            Next-gen video infrastructure, handled.
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            A strictly deterministic, high-performance API for rendering,
            transcoding, and streaming. Clinical precision at scale. No visual
            noise, just raw throughput.
          </p>
        </div>

        {/* Navigation Hub (Bento / Pill style) */}
        <div className="w-full max-w-5xl mx-auto mt-12">
          <div className="bg-surface-container-lowest border border-[#E5E7EB] rounded-full p-2 flex flex-col md:flex-row items-center justify-between shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col md:flex-row w-full items-center justify-evenly divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
              <button className="w-full md:w-auto py-4 md:py-3 px-6 font-code-md text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2 group">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                  graphic_eq
                </span>
                <span>audio processing</span>
              </button>
              <button className="w-full md:w-auto py-4 md:py-3 px-6 font-code-md text-primary font-medium flex items-center justify-center gap-2 bg-surface-container-low/50 rounded-lg md:rounded-none m-1 md:m-0">
                <span className="material-symbols-outlined text-secondary">
                  movie
                </span>
                <span>video processing</span>
              </button>
              <button className="w-full md:w-auto py-4 md:py-3 px-6 font-code-md text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2 group">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                  auto_awesome_motion
                </span>
                <span>sprite generation</span>
              </button>
            </div>
            <div className="w-full md:w-auto mt-4 md:mt-0 md:pl-4 flex-shrink-0">
              <Link
                href="/dashboard"
                className="w-full md:w-auto bg-primary text-on-primary font-code-md px-8 py-4 rounded-full hover:bg-tertiary-container transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Metric Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mt-20 pt-12 border-t border-[#E5E7EB]">
          <div className="flex flex-col items-center justify-center p-4">
            <span className="font-code-md text-outline-variant mb-1">
              Latency
            </span>
            <span className="font-headline-md text-primary">&lt; 12ms</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 md:border-l md:border-r border-[#E5E7EB]">
            <span className="font-code-md text-outline-variant mb-1">
              Uptime SLA
            </span>
            <span className="font-headline-md text-primary">99.999%</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="font-code-md text-outline-variant mb-1">
              Throughput
            </span>
            <span className="font-headline-md text-primary">100k req/s</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — INFRASTRUCTURE ("Deterministic Speed")
          ═══════════════════════════════════════════════════════ */}
      <section
        id="infrastructure"
        className="w-full max-w-[1200px] mx-auto px-4 md:px-10 py-20 flex flex-col gap-20"
      >
        {/* Header */}
        <header className="flex flex-col gap-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-caps text-on-surface-variant tracking-widest">
              PERFORMANCE PROOF
            </span>
          </div>
          <h2 className="font-display-hero text-primary font-bold">
            Deterministic Speed.
          </h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Streamweaver is built on Rust, providing bare-metal performance for
            HLS encryption and chunking. Zero garbage collection. Absolute
            memory predictability.
          </p>
        </header>

        {/* Content Grid: Code + Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Code Block Column */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-1">
              <span className="font-label-caps text-on-surface-variant">
                src/pipeline/hls_encrypt.rs
              </span>
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded-full border border-outline-variant"></span>
                <span className="w-3 h-3 rounded-full border border-outline-variant"></span>
                <span className="w-3 h-3 rounded-full border border-outline-variant"></span>
              </div>
            </div>
            <div className="bg-[#F9FAFB] border border-outline-variant p-6 rounded-2xl overflow-x-auto shadow-sm">
              <pre className="font-code-md text-on-surface leading-loose">
                <span className="text-on-surface-variant">
                  {"/// Encrypts an HLS TS segment using AES-128"}
                </span>
                {"\n"}
                <span className="font-bold text-primary">pub fn</span>{" "}
                <span className="text-secondary">encrypt_segment</span>
                {"(\n"}
                {"    data: "}
                <span className="font-bold">&amp;</span>
                {"["}
                <span className="font-bold text-primary">u8</span>
                {"], \n"}
                {"    key: "}
                <span className="font-bold">&amp;</span>
                {"["}
                <span className="font-bold text-primary">u8</span>
                {"; "}
                <span className="text-secondary">16</span>
                {"], \n"}
                {"    iv: "}
                <span className="font-bold">&amp;</span>
                {"["}
                <span className="font-bold text-primary">u8</span>
                {"; "}
                <span className="text-secondary">16</span>
                {"]\n"}
                {") -> "}
                <span className="font-bold text-primary">Result</span>
                {"<"}
                <span className="text-primary">Vec</span>
                {"<"}
                <span className="font-bold text-primary">u8</span>
                {">, "}
                <span className="text-primary">CryptoError</span>
                {"> {\n\n"}
                {"    "}
                <span className="font-bold text-primary">let mut</span>
                {" cipher = "}
                <span className="text-primary">Aes128CbcEnc</span>
                {"::new(key.into(), iv.into());\n"}
                {"    "}
                <span className="font-bold text-primary">let mut</span>
                {" buffer = "}
                <span className="text-primary">Vec</span>
                {"::with_capacity(data.len() + "}
                <span className="text-secondary">16</span>
                {");\n\n"}
                {"    buffer.extend_from_slice(data);\n\n"}
                {"    "}
                <span className="font-bold text-primary">let</span>
                {" ciphertext = cipher.encrypt_padded_mut::<"}
                <span className="text-primary">Pkcs7</span>
                {">("}
                {"\n        "}
                <span className="font-bold">&amp;mut</span>
                {" buffer, \n"}
                {"        data.len()\n"}
                {"    ).map_err(|_| "}
                <span className="text-primary">CryptoError</span>
                {"::"}
                <span className="text-secondary">PaddingError</span>
                {")?;\n\n"}
                {"    "}
                <span className="font-bold text-primary">Ok</span>
                {"(ciphertext.to_vec())\n}"}
              </pre>
            </div>
          </div>

          {/* Metrics Grid Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Memory Footprint */}
            <div className="border border-outline-variant p-6 rounded-2xl bg-surface-container-lowest flex flex-col gap-2 hover:border-primary transition-colors duration-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">
                  memory
                </span>
                <span className="font-label-caps text-on-surface-variant">
                  MEMORY FOOTPRINT
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg font-bold text-primary">
                  12
                </span>
                <span className="font-body-md text-on-surface-variant">
                  MB / Process
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant mt-2">
                Near-zero overhead compared to typical Node.js or JVM runtimes.
                Predictable memory allocation per stream.
              </p>
            </div>

            {/* Concurrency */}
            <div className="border border-outline-variant p-6 rounded-2xl bg-surface-container-lowest flex flex-col gap-2 hover:border-primary transition-colors duration-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">
                  hub
                </span>
                <span className="font-label-caps text-on-surface-variant">
                  CONCURRENCY
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg font-bold text-primary">
                  10k+
                </span>
                <span className="font-body-md text-on-surface-variant">
                  Active Pipelines
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant mt-2">
                Asynchronous I/O via Tokio allows thousands of concurrent HLS
                chunks to be processed and encrypted simultaneously.
              </p>
            </div>

            {/* Processing Speed */}
            <div className="border border-outline-variant p-6 rounded-2xl bg-surface-container-lowest flex flex-col gap-2 hover:border-primary transition-colors duration-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">
                  speed
                </span>
                <span className="font-label-caps text-on-surface-variant">
                  PROCESSING SPEED
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg font-bold text-primary">
                  4.2x
                </span>
                <span className="font-body-md text-on-surface-variant">
                  Faster
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant mt-2">
                Rust implementation outperforms equivalent Node.js pipelines by
                a factor of 4.2x in sustained throughput tests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — PIPELINE ("Processing Workbench")
          ═══════════════════════════════════════════════════════ */}
      <section
        id="pipelines"
        className="w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-20 flex flex-col gap-20"
      >
        {/* Header */}
        <div className="flex justify-between items-end border-b-precision pb-4">
          <div>
            <h2 className="font-headline-lg text-primary mb-2">
              Processing Workbench
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-2xl">
              Active monitoring of VOD Pipeline Alpha. Real-time encryption and
              chunking operations in progress.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-4 py-1 border-precision rounded-full bg-surface-container-low">
              <div className="w-2 h-2 rounded-full bg-secondary pulse-dot"></div>
              <span className="font-label-caps text-primary">
                System Healthy
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline Visualization */}
        <div className="relative bg-surface-container-low border-precision p-12 min-h-[400px] flex items-center justify-center overflow-hidden rounded-2xl">
          {/* Background Grid */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          ></div>

          <div className="relative z-10 w-full max-w-5xl flex items-center justify-between">
            {/* Node: Input */}
            <div className="flex flex-col items-center gap-4 relative">
              <div className="w-16 h-16 rounded-full border border-primary bg-surface-container-lowest flex items-center justify-center relative z-20">
                <span className="material-symbols-outlined text-primary">
                  login
                </span>
              </div>
              <span className="font-label-caps text-primary absolute -bottom-8 whitespace-nowrap">
                Source Ingestion
              </span>
            </div>

            {/* Line */}
            <div className="flex-1 px-4 relative">
              <div className="pipeline-line"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container-lowest px-2 font-code-md text-outline-variant">
                2.4 Gbps
              </div>
            </div>

            {/* Node: Chunking */}
            <div className="flex flex-col items-center gap-4 relative">
              <div className="w-16 h-16 rounded-full border border-primary bg-surface-container-lowest flex items-center justify-center relative z-20">
                <span className="material-symbols-outlined text-primary">
                  view_cozy
                </span>
              </div>
              <span className="font-label-caps text-primary absolute -bottom-8 whitespace-nowrap">
                HLS Chunking
              </span>
            </div>

            {/* Line */}
            <div className="flex-1 px-4 relative">
              <div className="pipeline-line"></div>
            </div>

            {/* Node: AES Encryption (ACTIVE) */}
            <div className="flex flex-col items-center gap-4 relative">
              <div className="absolute inset-0 border border-secondary rounded-full scale-125 animate-pulse"></div>
              <div className="w-20 h-20 rounded-full border-2 border-primary bg-secondary-container flex items-center justify-center relative z-20 shadow-[0_0_15px_rgba(255,208,125,0.4)]">
                <span
                  className="material-symbols-outlined text-on-secondary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  lock
                </span>
              </div>
              <span className="font-label-caps text-secondary absolute -bottom-10 whitespace-nowrap font-bold">
                AES-128 Encryption
              </span>
            </div>

            {/* Line */}
            <div className="flex-1 px-4 relative">
              <div className="border-t border-dashed border-primary h-0"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container-lowest px-2 font-code-md text-secondary pulse-dot">
                Processing
              </div>
            </div>

            {/* Node: Assembly */}
            <div className="flex flex-col items-center gap-4 relative">
              <div className="w-16 h-16 rounded-full border border-outline-variant bg-surface-container-lowest flex items-center justify-center relative z-20 opacity-50">
                <span className="material-symbols-outlined text-outline-variant">
                  data_object
                </span>
              </div>
              <span className="font-label-caps text-outline-variant absolute -bottom-8 whitespace-nowrap opacity-50">
                Manifest Assembly
              </span>
            </div>
          </div>
        </div>

        {/* Active Node Details & Live Logs (Bento Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration panel */}
          <div className="lg:col-span-1 border-precision bg-surface-container-lowest p-8 rounded-2xl">
            <h3 className="font-label-caps text-primary border-b-precision pb-2 mb-6 flex items-center justify-between">
              Configuration: AES-128
              <span
                className="material-symbols-outlined text-secondary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                radio_button_checked
              </span>
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b-precision pb-2">
                <span className="font-body-sm text-on-surface-variant">
                  Key Provider
                </span>
                <span className="font-code-md text-primary">AWS KMS</span>
              </div>
              <div className="flex justify-between items-center border-b-precision pb-2">
                <span className="font-body-sm text-on-surface-variant">
                  Rotation Interval
                </span>
                <span className="font-code-md text-primary">300s</span>
              </div>
              <div className="flex justify-between items-center border-b-precision pb-2">
                <span className="font-body-sm text-on-surface-variant">
                  Mode
                </span>
                <span className="font-code-md text-primary">CBC</span>
              </div>
              <div className="flex justify-between items-center border-b-precision pb-2">
                <span className="font-body-sm text-on-surface-variant">
                  Throughput
                </span>
                <span className="font-code-md text-secondary">1.2 GB/s</span>
              </div>
              <div className="mt-6">
                <button className="w-full border-precision bg-surface-container-lowest text-primary font-label-caps px-4 py-2 hover:bg-surface-container-low transition-colors cursor-pointer rounded-lg">
                  Modify Key Settings
                </button>
              </div>
            </div>
          </div>

          {/* Live Stream Log Ledger */}
          <div className="lg:col-span-2 border-precision bg-surface-container-lowest flex flex-col h-full max-h-[400px] rounded-2xl overflow-hidden">
            <div className="p-4 border-b-precision flex justify-between items-center bg-surface-container-low">
              <h3 className="font-label-caps text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">terminal</span>
                Process Ledger
              </h3>
              <div className="flex gap-2">
                <span className="font-label-caps text-outline-variant text-[10px]">
                  AUTO-SCROLL ON
                </span>
              </div>
            </div>
            <div className="p-4 overflow-y-auto font-code-md flex flex-col gap-1 flex-1">
              {/* Log Entries */}
              {[
                {
                  time: "14:02:01.045",
                  level: "[INFO]",
                  msg: "Ingesting block 4A9B...",
                },
                {
                  time: "14:02:01.120",
                  level: "[INFO]",
                  msg: "Chunking complete for block 4A9B. Fragments generated: 12.",
                },
                {
                  time: "14:02:01.125",
                  level: "[INFO]",
                  msg: "Initiating AES-128 CBC payload encryption...",
                  highlight: true,
                },
                {
                  time: "14:02:01.340",
                  level: "[INFO]",
                  msg: "Fragment 1/12 encrypted. Throughput: 1.21 GB/s.",
                },
                {
                  time: "14:02:01.450",
                  level: "[SUCCESS]",
                  msg: "Encryption validated for block 4A9B. IV stored.",
                  success: true,
                },
                {
                  time: "14:02:02.010",
                  level: "[INFO]",
                  msg: "Ingesting block 4A9C...",
                },
                {
                  time: "14:02:02.085",
                  level: "[INFO]",
                  msg: "Chunking complete for block 4A9C. Fragments generated: 12.",
                },
                {
                  time: "14:02:02.090",
                  level: "[INFO]",
                  msg: "Initiating AES-128 CBC payload encryption...",
                  highlight: true,
                  pulse: true,
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className="flex gap-4 py-1 border-b border-surface-container-high"
                >
                  <span className="text-outline-variant w-24 shrink-0">
                    {log.time}
                  </span>
                  <span
                    className={`w-16 shrink-0 ${log.success ? "text-primary font-bold" : "text-outline-variant"}`}
                  >
                    {log.level}
                  </span>
                  <span
                    className={`${log.success ? "text-primary font-bold" : log.highlight ? "text-secondary" : "text-on-surface-variant"} ${log.pulse ? "pulse-dot" : ""}`}
                  >
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="w-full mt-auto bg-surface-container-lowest border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-10 py-4 max-w-[1440px] mx-auto gap-4 md:gap-0">
          <span className="font-label-caps text-on-surface-variant font-bold">
            © 2024 STREAMWEAVER INFRASTRUCTURE. ALL RIGHTS RESERVED.
          </span>
          <nav className="flex gap-6">
            <a
              className="font-label-caps text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Terms
            </a>
            <a
              className="font-label-caps text-on-surface-variant hover:text-secondary transition-colors"
              href="#"
            >
              Privacy
            </a>
            <a
              className="font-label-caps text-primary underline"
              href="#"
            >
              Status
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
