// //this is the main dashboard 

// <!DOCTYPE html><html class="light" lang="en" style=""><head>
// <meta charset="utf-8">
// <meta content="width=device-width, initial-scale=1.0" name="viewport">
// <title>Streamweaver - Developer Dashboard</title>
// <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
// <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&amp;family=Inter:wght@100..900&amp;family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&amp;display=swap" rel="stylesheet">
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
// <script id="tailwind-config">
//         tailwind.config = {
//             darkMode: "class",
//             theme: {
//                 extend: {
//                     colors: {
//                         "secondary-fixed": "#ffdea8",
//                         "tertiary-fixed": "#e2e2e2",
//                         "surface-dim": "#cbdbf5",
//                         "on-surface-variant": "#4c4546",
//                         "on-error": "#ffffff",
//                         "inverse-on-surface": "#eaf1ff",
//                         "on-tertiary": "#ffffff",
//                         "error-container": "#ffdad6",
//                         "surface-variant": "#d3e4fe",
//                         "tertiary-container": "#1b1b1b",
//                         "primary-fixed": "#e2e2e2",
//                         "on-secondary-fixed-variant": "#5e4200",
//                         "on-secondary": "#ffffff",
//                         "on-tertiary-container": "#848484",
//                         "on-secondary-container": "#79570d",
//                         "on-surface": "#0b1c30",
//                         "surface-container-highest": "#d3e4fe",
//                         "on-secondary-fixed": "#271900",
//                         "secondary": "#7a580f",
//                         "secondary-container": "#ffd07d",
//                         "on-error-container": "#93000a",
//                         "tertiary-fixed-dim": "#c6c6c6",
//                         "surface-container-low": "#eff4ff",
//                         "secondary-fixed-dim": "#edc06e",
//                         "tertiary": "#000000",
//                         "surface-container-high": "#dce9ff",
//                         "inverse-surface": "#213145",
//                         "on-tertiary-fixed": "#1b1b1b",
//                         "on-primary": "#ffffff",
//                         "surface-bright": "#f8f9ff",
//                         "outline": "#7e7576",
//                         "on-primary-fixed": "#1b1b1b",
//                         "primary-container": "#1b1b1b",
//                         "outline-variant": "#cfc4c5",
//                         "on-primary-container": "#848484",
//                         "surface": "#f8f9ff",
//                         "inverse-primary": "#c6c6c6",
//                         "surface-container-lowest": "#ffffff",
//                         "surface-tint": "#5e5e5e",
//                         "on-background": "#0b1c30",
//                         "on-tertiary-fixed-variant": "#474747",
//                         "on-primary-fixed-variant": "#474747",
//                         "background": "#f8f9ff",
//                         "surface-container": "#e5eeff",
//                         "error": "#ba1a1a",
//                         "primary": "#000000",
//                         "primary-fixed-dim": "#c6c6c6"
//                     },
//                     borderRadius: {
//                         "DEFAULT": "0px",
//                         "lg": "0px",
//                         "xl": "0px",
//                         "full": "0px"
//                     },
//                     spacing: {
//                         "lg": "24px",
//                         "margin-mobile": "16px",
//                         "xl": "48px",
//                         "margin-desktop": "40px",
//                         "md": "16px",
//                         "gutter": "24px",
//                         "unit": "4px",
//                         "sm": "8px",
//                         "xxl": "80px",
//                         "xs": "4px"
//                     },
//                     fontFamily: {
//                         "headline-md": ["Bodoni Moda"],
//                         "headline-lg": ["Bodoni Moda"],
//                         "code-md": ["JetBrains Mono"],
//                         "body-lg": ["Inter"],
//                         "body-md": ["Inter"],
//                         "label-caps": ["JetBrains Mono"],
//                         "headline-lg-mobile": ["Bodoni Moda"],
//                         "display-hero": ["Bodoni Moda"],
//                         "body-sm": ["Inter"]
//                     },
//                     fontSize: {
//                         "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "500" }],
//                         "headline-lg": ["40px", { "lineHeight": "1.2", "fontWeight": "500" }],
//                         "code-md": ["14px", { "lineHeight": "1.6", "fontWeight": "400" }],
//                         "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
//                         "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }],
//                         "label-caps": ["12px", { "lineHeight": "1.0", "letterSpacing": "0.1em", "fontWeight": "500" }],
//                         "headline-lg-mobile": ["32px", { "lineHeight": "1.2", "fontWeight": "500" }],
//                         "display-hero": ["72px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600" }],
//                         "body-sm": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }]
//                     }
//                 }
//             }
//         }
//     </script>
// <style>
//         body {
//             background-color: #FAFAFA;
//         }
//         .grid-pattern {
//             background-image: 
//                 linear-gradient(to right, #E5E7EB 1px, transparent 1px),
//                 linear-gradient(to bottom, #E5E7EB 1px, transparent 1px);
//             background-size: 40px 40px;
//         }
//         .tiny-mono {
//             font-family: 'JetBrains Mono', monospace;
//             font-size: 11px;
//             color: #6B7280; /* text-gray-500 equivalent */
//         }
//     </style>
// </head>
// <body class="h-screen w-full flex overflow-hidden">
// <!-- SideNavBar (Shared Component) -->
// <aside class="bg-surface-container-low h-full w-64 left-0 border-r border-outline-variant flex flex-col py-xl transition-all duration-75 shrink-0 z-10 hidden md:flex">
// <div class="px-md mb-xl">
// <h1 class="font-headline-md text-headline-md text-primary">Streamweaver</h1>
// <div class="mt-lg">
// <p class="font-code-md text-code-md text-primary font-bold">Project Alpha</p>
// <p class="font-label-caps text-label-caps text-on-surface-variant mt-xs">V-INFRA-NODE-01</p>
// </div>
// </div>
// <nav class="flex-1 px-sm space-y-sm">
// <a class="flex items-center gap-md px-md py-sm bg-secondary-container text-on-secondary-container font-bold rounded-none" href="#">
// <span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
// <span class="font-code-md text-code-md">Dashboard</span>
// </a>
// <a class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-none transition-all duration-75" href="#">
// <span class="material-symbols-outlined" data-icon="dataset">dataset</span>
// <span class="font-code-md text-code-md">Infrastructure</span>
// </a>
// <a class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-none transition-all duration-75" href="#">
// <span class="material-symbols-outlined" data-icon="account_tree">account_tree</span>
// <span class="font-code-md text-code-md">Pipelines</span>
// </a>
// <a class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-none transition-all duration-75" href="#">
// <span class="material-symbols-outlined" data-icon="analytics">analytics</span>
// <span class="font-code-md text-code-md">Logs</span>
// </a>
// <a class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-none transition-all duration-75" href="#">
// <span class="material-symbols-outlined" data-icon="key">key</span>
// <span class="font-code-md text-code-md">API Keys</span>
// </a>
// </nav>
// <div class="px-md mt-auto space-y-sm">
// <button class="w-full bg-primary text-on-primary font-code-md text-code-md py-sm rounded-none border border-primary hover:bg-transparent hover:text-primary transition-colors">
//                 New Stream
//             </button>
// <div class="border-t border-outline-variant pt-sm mt-md space-y-sm">
// <a class="flex items-center gap-md px-md py-xs text-on-surface-variant hover:text-on-surface transition-all duration-75" href="#">
// <span class="material-symbols-outlined text-[18px]" data-icon="menu_book">menu_book</span>
// <span class="font-code-md text-[12px]">Documentation</span>
// </a>
// <a class="flex items-center gap-md px-md py-xs text-on-surface-variant hover:text-on-surface transition-all duration-75" href="#">
// <span class="material-symbols-outlined text-[18px]" data-icon="contact_support">contact_support</span>
// <span class="font-code-md text-[12px]">Support</span>
// </a>
// </div>
// </div>
// </aside>
// <!-- Main Content Area -->
// <main class="flex-1 flex flex-col h-full relative">
// <!-- TopAppBar (Shared Component) - Mobile Only -->
// <header class="bg-surface w-full top-0 border-b border-outline-variant flex justify-between items-center px-margin-mobile py-md md:hidden shrink-0 z-10">
// <h1 class="font-headline-md text-headline-md font-bold text-primary">Streamweaver</h1>
// <div class="flex gap-md">
// <button class="text-on-surface-variant hover:bg-surface-container transition-colors duration-150 p-xs">
// <span class="material-symbols-outlined" data-icon="terminal">terminal</span>
// </button>
// <button class="text-on-surface-variant hover:bg-surface-container transition-colors duration-150 p-xs">
// <span class="material-symbols-outlined" data-icon="settings">settings</span>
// </button>
// <button class="text-on-surface-variant hover:bg-surface-container transition-colors duration-150 p-xs">
// <span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
// </button>
// </div>
// </header>
// <!-- Desktop Top Actions (from TopAppBar context) -->
// <div class="absolute top-0 right-0 p-md flex gap-md z-20 hidden md:flex">
// <button class="text-on-surface-variant hover:bg-surface-container transition-colors duration-150 p-xs">
// <span class="material-symbols-outlined" data-icon="terminal">terminal</span>
// </button>
// <button class="text-on-surface-variant hover:bg-surface-container transition-colors duration-150 p-xs">
// <span class="material-symbols-outlined" data-icon="settings">settings</span>
// </button>
// <button class="text-on-surface-variant hover:bg-surface-container transition-colors duration-150 p-xs">
// <span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
// </button>
// </div>
// <!-- Horizontal Split Layout -->
// <div class="flex-1 flex flex-col">
// <!-- Top Half: Architectural Workspace Grid -->
// <div class="flex-1 relative border-b border-[#E5E7EB]"><div class="absolute inset-0 grid-pattern opacity-30"></div><div class="absolute top-md left-md z-10"><span class="tiny-mono tracking-widest uppercase">Workspace // Media_Workbench_01</span></div><div class="relative w-full h-full flex items-center justify-center p-lg"><div class="relative w-full max-w-4xl aspect-video bg-surface-container-lowest border border-outline-variant flex flex-col items-center justify-center overflow-hidden"><div id="media-dropzone" class="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant bg-surface-container-lowest transition-opacity duration-150"><h2 class="font-headline-md text-headline-md text-primary mb-xs">Ingest raw media payload</h2><p class="tiny-mono">Awaiting Cloudinary uplink...</p></div><div id="media-player-frame" class="absolute inset-0 bg-surface-container-low hidden flex items-center justify-center"><span class="material-symbols-outlined text-primary opacity-20 text-[48px]">play_circle</span></div><div class="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant"><div class="h-full bg-primary w-1/3 transition-all duration-500"></div></div></div></div></div>
// <!-- Bottom Half: Performance Monitoring -->
// <div class="flex-1 flex">
// <!-- Section 1: Pipeline Latency -->
// <div class="flex-1 border-r border-[#E5E7EB] flex flex-col p-lg relative">
// <div class="flex justify-between items-center mb-xl">
// <span class="tiny-mono tracking-widest uppercase text-primary font-bold">Pipeline Latency (ms)</span>
// <div class="flex items-center gap-xs">
// <span class="w-unit h-unit bg-primary rounded-none"></span>
// <span class="tiny-mono">LIVE</span>
// </div>
// </div>
// <div class="flex-1 relative flex items-end">
// <!-- Y-Axis Labels -->
// <div class="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-sm h-full">
// <span class="tiny-mono">120</span>
// <span class="tiny-mono">80</span>
// <span class="tiny-mono">40</span>
// <span class="tiny-mono">0</span>
// </div>
// <!-- Graph Canvas -->
// <div class="ml-xl flex-1 h-full relative">
// <!-- SVG Line Graph (Pure Black, no fills) -->
// <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
// <polyline fill="none" points="0,80 10,75 20,85 30,60 40,65 50,40 60,45 70,20 80,30 90,10 100,15" stroke="#000000" stroke-width="1.5" vector-effect="non-scaling-stroke"></polyline>
// </svg>
// <!-- X-Axis Labels -->
// <div class="absolute -bottom-md left-0 w-full flex justify-between">
// <span class="tiny-mono">T-60s</span>
// <span class="tiny-mono">T-30s</span>
// <span class="tiny-mono">NOW</span>
// </div>
// </div>
// </div>
// </div>
// <!-- Section 2: Throughput -->
// <div class="flex-1 flex flex-col p-lg relative">
// <div class="flex justify-between items-center mb-xl">
// <span class="tiny-mono tracking-widest uppercase text-primary font-bold">Throughput (MB/s)</span>
// <div class="flex items-center gap-xs">
// <span class="w-unit h-unit bg-primary rounded-none"></span>
// <span class="tiny-mono">LIVE</span>
// </div>
// </div>
// <div class="flex-1 relative flex items-end">
// <!-- Y-Axis Labels -->
// <div class="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-sm h-full">
// <span class="tiny-mono">1000</span>
// <span class="tiny-mono">750</span>
// <span class="tiny-mono">500</span>
// <span class="tiny-mono">0</span>
// </div>
// <!-- Graph Canvas -->
// <div class="ml-xl flex-1 h-full relative">
// <!-- SVG Line Graph (Pure Black, no fills) -->
// <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
// <polyline fill="none" points="0,90 15,80 30,85 45,50 60,55 75,30 90,35 100,10" stroke="#000000" stroke-width="1.5" vector-effect="non-scaling-stroke"></polyline>
// </svg>
// <!-- X-Axis Labels -->
// <div class="absolute -bottom-md left-0 w-full flex justify-between">
// <span class="tiny-mono">T-60s</span>
// <span class="tiny-mono">T-30s</span>
// <span class="tiny-mono">NOW</span>
// </div>
// </div>
// </div>
// </div>
// <div class="flex-1 flex flex-col p-lg relative border-l border-[#E5E7EB]"><div class="flex justify-between items-center mb-xl"><span class="tiny-mono tracking-widest uppercase text-primary font-bold">Asynchronous Job Ledger</span></div><div class="flex-1 overflow-auto"><table class="w-full text-left border-collapse"><thead class="border-b border-[#E5E7EB]"><tr><th class="py-xs font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">Job ID</th><th class="py-xs font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">Source</th><th class="py-xs font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">Engine Status</th><th class="py-xs font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">Action</th></tr></thead><tbody class="tiny-mono"><tr class="border-b border-[#E5E7EB]"><td class="py-sm">SW-881</td><td class="py-sm">S3-BUCKET-01</td><td class="py-sm font-code-md">[QUEUE_INGEST]</td><td class="py-sm">-</td></tr><tr class="border-b border-[#E5E7EB]"><td class="py-sm">SW-882</td><td class="py-sm">LOCAL-PAYLOAD</td><td class="py-sm font-code-md">[WORKER_ACTIVE: CHUNKING]</td><td class="py-sm">-</td></tr><tr class="border-b border-[#E5E7EB]"><td class="py-sm">SW-883</td><td class="py-sm">CLOUDINARY-UP</td><td class="py-sm font-code-md">[AES_ENCRYPTING]</td><td class="py-sm">-</td></tr><tr class="border-b border-[#E5E7EB]"><td class="py-sm">SW-884</td><td class="py-sm">CDN-RELAY-04</td><td class="py-sm font-code-md">[SUCCESS: R2_STORED]</td><td class="py-sm"><button class="font-code-md text-[12px] text-primary underline">Download Package (.zip)</button></td></tr></tbody></table></div></div></div>
// </div>
// </main>


// </body></html>