// <!DOCTYPE html>
// //this is for the hero section of the landing page 
// <html class="light" lang="en"><head>
// <meta charset="utf-8"/>
// <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
// <title>Streamweaver - Next-gen video infrastructure, handled</title>
// <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
// <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;500;600;700;800;900&amp;family=Inter:wght@400;500;600&amp;family=JetBrains+Mono:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <script id="tailwind-config">
//         tailwind.config = {
//             darkMode: "class",
//             theme: {
//                 extend: {
//                     "colors": {
//                         "tertiary-container": "#1b1b1b",
//                         "on-tertiary-fixed": "#1b1b1b",
//                         "on-secondary-fixed-variant": "#5e4200",
//                         "surface": "#f8f9ff",
//                         "surface-container-high": "#dce9ff",
//                         "error-container": "#ffdad6",
//                         "inverse-primary": "#c6c6c6",
//                         "outline-variant": "#cfc4c5",
//                         "on-secondary": "#ffffff",
//                         "on-primary-container": "#848484",
//                         "on-primary-fixed": "#1b1b1b",
//                         "tertiary-fixed": "#e2e2e2",
//                         "error": "#ba1a1a",
//                         "surface-tint": "#5e5e5e",
//                         "surface-dim": "#cbdbf5",
//                         "primary-container": "#1b1b1b",
//                         "surface-bright": "#f8f9ff",
//                         "on-secondary-container": "#79570d",
//                         "secondary-fixed": "#ffdea8",
//                         "secondary-container": "#ffd07d",
//                         "on-secondary-fixed": "#271900",
//                         "on-background": "#0b1c30",
//                         "primary": "#000000",
//                         "secondary": "#7a580f",
//                         "surface-container-low": "#eff4ff",
//                         "surface-container": "#e5eeff",
//                         "inverse-surface": "#213145",
//                         "on-tertiary": "#ffffff",
//                         "surface-container-lowest": "#ffffff",
//                         "on-surface-variant": "#4c4546",
//                         "on-primary-fixed-variant": "#474747",
//                         "primary-fixed-dim": "#c6c6c6",
//                         "on-surface": "#0b1c30",
//                         "tertiary-fixed-dim": "#c6c6c6",
//                         "tertiary": "#000000",
//                         "on-tertiary-fixed-variant": "#474747",
//                         "on-primary": "#ffffff",
//                         "inverse-on-surface": "#eaf1ff",
//                         "background": "#f8f9ff",
//                         "outline": "#7e7576",
//                         "primary-fixed": "#e2e2e2",
//                         "secondary-fixed-dim": "#edc06e",
//                         "surface-container-highest": "#d3e4fe",
//                         "on-tertiary-container": "#848484",
//                         "on-error": "#ffffff",
//                         "surface-variant": "#d3e4fe",
//                         "on-error-container": "#93000a"
//                     },
//                     "borderRadius": {
//                         "DEFAULT": "1rem",
//                         "lg": "2rem",
//                         "xl": "3rem",
//                         "full": "9999px"
//                     },
//                     "spacing": {
//                         "gutter": "24px",
//                         "xl": "48px",
//                         "sm": "8px",
//                         "xs": "4px",
//                         "margin-desktop": "40px",
//                         "xxl": "80px",
//                         "lg": "24px",
//                         "md": "16px",
//                         "unit": "4px",
//                         "margin-mobile": "16px"
//                     },
//                     "fontFamily": {
//                         "body-sm": ["Inter"],
//                         "code-md": ["JetBrains Mono"],
//                         "body-lg": ["Inter"],
//                         "label-caps": ["JetBrains Mono"],
//                         "body-md": ["Inter"],
//                         "display-hero": ["Bodoni Moda"],
//                         "headline-md": ["Bodoni Moda"],
//                         "headline-lg-mobile": ["Bodoni Moda"],
//                         "headline-lg": ["Bodoni Moda"]
//                     },
//                     "fontSize": {
//                         "body-sm": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }],
//                         "code-md": ["14px", { "lineHeight": "1.6", "fontWeight": "400" }],
//                         "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
//                         "label-caps": ["12px", { "lineHeight": "1.0", "letterSpacing": "0.1em", "fontWeight": "500" }],
//                         "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }],
//                         "display-hero": ["72px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600" }],
//                         "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "500" }],
//                         "headline-lg-mobile": ["32px", { "lineHeight": "1.2", "fontWeight": "500" }],
//                         "headline-lg": ["40px", { "lineHeight": "1.2", "fontWeight": "500" }]
//                     }
//                 }
//             }
//         }
//     </script>
// <style>
//         .dot-grid {
//             background-image: radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px);
//             background-size: 20px 20px;
//         }
//         .material-symbols-outlined {
//             font-family: 'Material Symbols Outlined';
//             font-weight: normal;
//             font-style: normal;
//             font-size: 24px;
//             line-height: 1;
//             letter-spacing: normal;
//             text-transform: none;
//             display: inline-block;
//             white-space: nowrap;
//             word-wrap: normal;
//             direction: ltr;
//             -webkit-font-feature-settings: 'liga';
//             -webkit-font-smoothing: antialiased;
//         }
//     </style>
// </head>
// <body class="bg-surface-container-lowest text-on-surface font-body-md min-h-screen flex flex-col relative dot-grid selection:bg-secondary-container selection:text-on-secondary-container">
// <!-- Top Navigation Area (from JSON) -->
// <header class="w-full z-50 bg-surface-container-lowest dark:bg-surface-container-lowest border-b border-outline-variant dark:border-outline">
// <div class="flex justify-between items-center w-full px-margin-desktop py-4 mx-auto max-w-[1440px]">
// <!-- Brand -->
// <a class="font-headline-md text-headline-md tracking-tighter font-black text-primary dark:text-primary-fixed" href="#">STREAMWEAVER</a>
// <!-- Desktop Nav -->
// <nav class="hidden md:flex gap-lg items-center">
// <a class="font-label-caps text-label-caps text-primary dark:text-primary-fixed border-b-2 border-secondary font-bold py-1" href="#">Streams</a>
// <a class="font-label-caps text-label-caps text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors duration-200 py-1 px-2 rounded-sm cursor-pointer active:opacity-80 transition-opacity" href="#">Pipelines</a>
// <a class="font-label-caps text-label-caps text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors duration-200 py-1 px-2 rounded-sm cursor-pointer active:opacity-80 transition-opacity" href="#">Infrastructure</a>
// <a class="font-label-caps text-label-caps text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors duration-200 py-1 px-2 rounded-sm cursor-pointer active:opacity-80 transition-opacity" href="#">Logs</a>
// </nav>
// <!-- Actions -->
// <div class="flex items-center gap-md">
// <div class="hidden sm:flex gap-sm">
// <button class="p-2 hover:bg-surface-container-low rounded-full transition-colors duration-200 cursor-pointer active:opacity-80 text-primary dark:text-primary-fixed">
// <span class="material-symbols-outlined" data-icon="settings">settings</span>
// </button>
// <button class="p-2 hover:bg-surface-container-low rounded-full transition-colors duration-200 cursor-pointer active:opacity-80 text-primary dark:text-primary-fixed">
// <span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
// </button>
// </div>
// <button class="bg-primary text-on-primary font-label-caps text-label-caps px-6 py-2 rounded-full hover:opacity-90 transition-opacity">Deploy</button>
// </div>
// </div>
// </header>
// <!-- Main Content -->
// <main class="flex-grow flex flex-col justify-center items-center px-margin-mobile md:px-margin-desktop py-xxl relative z-10 w-full max-w-[1200px] mx-auto text-center">
// <!-- Hero Section -->
// <div class="max-w-4xl mx-auto space-y-lg mb-xxl">
// <h1 class="font-display-hero text-display-hero text-primary hidden md:block">Next-gen video infrastructure, handled.</h1>
// <h1 class="font-headline-lg-mobile text-headline-lg-mobile text-primary block md:hidden">Next-gen video infrastructure, handled.</h1>
// <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
//                 A strictly deterministic, high-performance API for rendering, transcoding, and streaming. Clinical precision at scale. No visual noise, just raw throughput.
//             </p>
// </div>
// <!-- Navigation Hub (Bento/Pill style) -->
// <div class="w-full max-w-5xl mx-auto mt-xl">
// <div class="bg-surface-container-lowest border border-[#E5E7EB] rounded-full p-2 flex flex-col md:flex-row items-center justify-between shadow-sm transition-all duration-300 hover:shadow-md">
// <div class="flex flex-col md:flex-row w-full items-center justify-evenly divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
// <button class="w-full md:w-auto py-4 md:py-3 px-6 font-code-md text-code-md text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2 group">
// <span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="graphic_eq">graphic_eq</span>
// <span>audio processing</span>
// </button>
// <button class="w-full md:w-auto py-4 md:py-3 px-6 font-code-md text-code-md text-primary font-medium flex items-center justify-center gap-2 bg-surface-container-low/50 rounded-lg md:rounded-none m-1 md:m-0">
// <span class="material-symbols-outlined text-secondary" data-icon="movie">movie</span>
// <span>video processing</span>
// </button>
// <button class="w-full md:w-auto py-4 md:py-3 px-6 font-code-md text-code-md text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2 group">
// <span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="auto_awesome_motion">auto_awesome_motion</span>
// <span>sprite generation</span>
// </button>
// </div>
// <div class="w-full md:w-auto mt-4 md:mt-0 md:pl-4 flex-shrink-0">
// <button class="w-full md:w-auto bg-primary text-on-primary font-code-md text-code-md px-8 py-4 rounded-full hover:bg-tertiary-container transition-colors flex items-center justify-center gap-2">
// <span>Launch</span>
// <span class="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
// </button>
// </div>
// </div>
// </div>
// <!-- Metric Highlights (Clinical Data display) -->
// <div class="grid grid-cols-1 md:grid-cols-3 gap-lg w-full max-w-4xl mx-auto mt-xxl pt-xl border-t border-[#E5E7EB]">
// <div class="flex flex-col items-center justify-center p-md">
// <span class="font-code-md text-code-md text-outline-variant mb-xs">Latency</span>
// <span class="font-headline-md text-headline-md text-primary">&lt; 12ms</span>
// </div>
// <div class="flex flex-col items-center justify-center p-md md:border-l md:border-r border-[#E5E7EB]">
// <span class="font-code-md text-code-md text-outline-variant mb-xs">Uptime SLA</span>
// <span class="font-headline-md text-headline-md text-primary">99.999%</span>
// </div>
// <div class="flex flex-col items-center justify-center p-md">
// <span class="font-code-md text-code-md text-outline-variant mb-xs">Throughput</span>
// <span class="font-headline-md text-headline-md text-primary">100k req/s</span>
// </div>
// </div>
// </main>
// <!-- Footer (from JSON) -->
// <footer class="w-full mt-auto bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant dark:border-outline">
// <div class="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-md max-w-[1440px] mx-auto gap-4 md:gap-0">
// <span class="font-label-caps text-label-caps text-on-surface-variant dark:text-on-surface-variant font-bold">© 2024 STREAMWEAVER INFRASTRUCTURE. ALL RIGHTS RESERVED.</span>
// <nav class="flex gap-lg">
// <a class="font-label-caps text-label-caps text-on-surface-variant dark:text-on-surface-variant hover:text-secondary transition-colors opacity-100" href="#">Terms</a>
// <a class="font-label-caps text-label-caps text-on-surface-variant dark:text-on-surface-variant hover:text-secondary transition-colors opacity-100" href="#">Privacy</a>
// <a class="font-label-caps text-label-caps text-primary dark:text-primary-fixed underline opacity-100" href="#">Status</a>
// </nav>
// </div>
// </footer>
// </body></html>


// //this is for the infrstructure section of the landing page 
// <!DOCTYPE html>

// <html class="light" lang="en"><head>
// <meta charset="utf-8"/>
// <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
// <title>Streamweaver - Proof</title>
// <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
// <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&amp;family=Inter:wght@100..900&amp;family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&amp;display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <script id="tailwind-config">
//         tailwind.config = {
//             darkMode: "class",
//             theme: {
//                 extend: {
//                     "colors": {
//                         "secondary-container": "#ffd07d",
//                         "secondary-fixed": "#ffdea8",
//                         "on-secondary-container": "#79570d",
//                         "surface-bright": "#f8f9ff",
//                         "primary-container": "#1b1b1b",
//                         "surface-dim": "#cbdbf5",
//                         "surface-tint": "#5e5e5e",
//                         "error": "#ba1a1a",
//                         "tertiary-fixed": "#e2e2e2",
//                         "on-primary-fixed": "#1b1b1b",
//                         "on-primary-container": "#848484",
//                         "on-secondary": "#ffffff",
//                         "outline-variant": "#cfc4c5",
//                         "inverse-primary": "#c6c6c6",
//                         "error-container": "#ffdad6",
//                         "surface-container-high": "#dce9ff",
//                         "surface": "#f8f9ff",
//                         "on-secondary-fixed-variant": "#5e4200",
//                         "on-tertiary-fixed": "#1b1b1b",
//                         "tertiary-container": "#1b1b1b",
//                         "surface-variant": "#d3e4fe",
//                         "on-error-container": "#93000a",
//                         "on-error": "#ffffff",
//                         "on-tertiary-container": "#848484",
//                         "surface-container-highest": "#d3e4fe",
//                         "secondary-fixed-dim": "#edc06e",
//                         "primary-fixed": "#e2e2e2",
//                         "outline": "#7e7576",
//                         "on-primary": "#ffffff",
//                         "inverse-on-surface": "#eaf1ff",
//                         "tertiary": "#000000",
//                         "tertiary-fixed-dim": "#c6c6c6",
//                         "on-tertiary-fixed-variant": "#474747",
//                         "background": "#f8f9ff",
//                         "on-surface": "#0b1c30",
//                         "primary-fixed-dim": "#c6c6c6",
//                         "on-primary-fixed-variant": "#474747",
//                         "on-surface-variant": "#4c4546",
//                         "surface-container-lowest": "#ffffff",
//                         "on-tertiary": "#ffffff",
//                         "inverse-surface": "#213145",
//                         "surface-container": "#e5eeff",
//                         "surface-container-low": "#eff4ff",
//                         "secondary": "#7a580f",
//                         "primary": "#000000",
//                         "on-secondary-fixed": "#271900",
//                         "on-background": "#0b1c30"
//                     },
//                     "borderRadius": {
//                         "DEFAULT": "1rem",
//                         "lg": "2rem",
//                         "xl": "3rem",
//                         "full": "9999px"
//                     },
//                     "spacing": {
//                         "gutter": "24px",
//                         "xl": "48px",
//                         "sm": "8px",
//                         "xs": "4px",
//                         "margin-desktop": "40px",
//                         "xxl": "80px",
//                         "lg": "24px",
//                         "md": "16px",
//                         "margin-mobile": "16px",
//                         "unit": "4px"
//                     },
//                     "fontFamily": {
//                         "label-caps": ["JetBrains Mono"],
//                         "body-md": ["Inter"],
//                         "display-hero": ["Bodoni Moda"],
//                         "headline-md": ["Bodoni Moda"],
//                         "headline-lg-mobile": ["Bodoni Moda"],
//                         "headline-lg": ["Bodoni Moda"],
//                         "body-sm": ["Inter"],
//                         "code-md": ["JetBrains Mono"],
//                         "body-lg": ["Inter"]
//                     },
//                     "fontSize": {
//                         "label-caps": ["12px", { "lineHeight": "1.0", "letterSpacing": "0.1em", "fontWeight": "500" }],
//                         "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }],
//                         "display-hero": ["72px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600" }],
//                         "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "500" }],
//                         "headline-lg-mobile": ["32px", { "lineHeight": "1.2", "fontWeight": "500" }],
//                         "headline-lg": ["40px", { "lineHeight": "1.2", "fontWeight": "500" }],
//                         "body-sm": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }],
//                         "code-md": ["14px", { "lineHeight": "1.6", "fontWeight": "400" }],
//                         "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }]
//                     }
//                 }
//             }
//         }
//     </script>
// <style>
//         .material-symbols-outlined {
//             font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
//         }
//     </style>
// </head>
// <body class="bg-surface-container-lowest text-on-surface min-h-screen flex flex-col font-body-md selection:bg-secondary-container selection:text-on-secondary-container">
// <!-- TopNavBar -->
// <nav class="bg-surface-container-lowest border-b border-outline-variant w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 mx-auto z-50 sticky top-0">
// <div class="flex items-center gap-gutter">
// <span class="font-headline-md text-headline-md tracking-tighter font-black text-primary">STREAMWEAVER</span>
// </div>
// <div class="hidden md:flex items-center gap-lg">
// <a class="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors duration-200 py-sm" href="#">Streams</a>
// <a class="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors duration-200 py-sm" href="#">Pipelines</a>
// <a class="font-label-caps text-label-caps text-primary border-b-2 border-secondary font-bold py-sm" href="#">Infrastructure</a>
// <a class="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors duration-200 py-sm" href="#">Logs</a>
// </div>
// <div class="flex items-center gap-md">
// <button class="hidden md:flex items-center justify-center bg-primary text-on-primary rounded-full px-lg py-sm font-label-caps text-label-caps hover:opacity-80 transition-opacity">Deploy</button>
// <div class="flex items-center gap-sm">
// <span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors duration-200" data-icon="settings">settings</span>
// <span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors duration-200" data-icon="account_circle">account_circle</span>
// </div>
// </div>
// </nav>
// <main class="flex-grow w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xxl flex flex-col gap-xxl">
// <!-- Header Section -->
// <header class="flex flex-col gap-md max-w-3xl">
// <div class="flex items-center gap-sm">
// <span class="w-2 h-2 rounded-full bg-secondary"></span>
// <span class="font-label-caps text-label-caps text-on-surface-variant tracking-widest">PERFORMANCE PROOF</span>
// </div>
// <h1 class="font-display-hero text-display-hero text-primary font-bold">Deterministic Speed.</h1>
// <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
//                 Streamweaver is built on Rust, providing bare-metal performance for HLS encryption and chunking. 
//                 Zero garbage collection. Absolute memory predictability.
//             </p>
// </header>
// <!-- Main Content Grid -->
// <section class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
// <!-- Code Block Column -->
// <div class="lg:col-span-7 flex flex-col gap-md">
// <div class="flex items-center justify-between border-b border-outline-variant pb-xs">
// <span class="font-label-caps text-label-caps text-on-surface-variant">src/pipeline/hls_encrypt.rs</span>
// <div class="flex gap-xs">
// <span class="w-3 h-3 rounded-full border border-outline-variant"></span>
// <span class="w-3 h-3 rounded-full border border-outline-variant"></span>
// <span class="w-3 h-3 rounded-full border border-outline-variant"></span>
// </div>
// </div>
// <div class="bg-[#F9FAFB] border border-outline-variant p-lg rounded-DEFAULT overflow-x-auto shadow-sm">
// <pre class="font-code-md text-code-md text-on-surface leading-loose"><span class="text-on-surface-variant">/// Encrypts an HLS TS segment using AES-128</span>
// <span class="font-bold text-primary">pub fn</span> <span class="text-secondary">encrypt_segment</span>(
//     data: <span class="font-bold">&amp;</span>[<span class="font-bold text-primary">u8</span>], 
//     key: <span class="font-bold">&amp;</span>[<span class="font-bold text-primary">u8</span>; <span class="text-secondary">16</span>], 
//     iv: <span class="font-bold">&amp;</span>[<span class="font-bold text-primary">u8</span>; <span class="text-secondary">16</span>]
// ) -&gt; <span class="font-bold text-primary">Result</span>&lt;<span class="text-primary">Vec</span>&lt;<span class="font-bold text-primary">u8</span>&gt;, <span class="text-primary">CryptoError</span>&gt; {
    
//     <span class="font-bold text-primary">let mut</span> cipher = <span class="text-primary">Aes128CbcEnc</span>::new(key.into(), iv.into());
//     <span class="font-bold text-primary">let mut</span> buffer = <span class="text-primary">Vec</span>::with_capacity(data.len() + <span class="text-secondary">16</span>);
    
//     buffer.extend_from_slice(data);
    
//     <span class="font-bold text-primary">let</span> ciphertext = cipher.encrypt_padded_mut::&lt;<span class="text-primary">Pkcs7</span>&gt;(
//         <span class="font-bold">&amp;mut</span> buffer, 
//         data.len()
//     ).map_err(|_| <span class="text-primary">CryptoError</span>::<span class="text-secondary">PaddingError</span>)?;

//     <span class="font-bold text-primary">Ok</span>(ciphertext.to_vec())
// }
// </pre>
// </div>
// </div>
// <!-- Metrics Grid Column -->
// <div class="lg:col-span-5 flex flex-col gap-gutter">
// <!-- Metric 1 -->
// <div class="border border-outline-variant p-lg rounded-DEFAULT bg-surface-container-lowest flex flex-col gap-sm hover:border-primary transition-colors duration-200">
// <div class="flex items-center gap-sm">
// <span class="material-symbols-outlined text-secondary" data-icon="memory">memory</span>
// <span class="font-label-caps text-label-caps text-on-surface-variant">MEMORY FOOTPRINT</span>
// </div>
// <div class="flex items-baseline gap-sm">
// <span class="font-headline-lg text-headline-lg font-bold text-primary">12</span>
// <span class="font-body-md text-body-md text-on-surface-variant">MB / Process</span>
// </div>
// <p class="font-body-sm text-body-sm text-on-surface-variant mt-sm">
//                         Near-zero overhead compared to typical Node.js or JVM runtimes. Predictable memory allocation per stream.
//                     </p>
// </div>
// <!-- Metric 2 -->
// <div class="border border-outline-variant p-lg rounded-DEFAULT bg-surface-container-lowest flex flex-col gap-sm hover:border-primary transition-colors duration-200">
// <div class="flex items-center gap-sm">
// <span class="material-symbols-outlined text-secondary" data-icon="hub">hub</span>
// <span class="font-label-caps text-label-caps text-on-surface-variant">CONCURRENCY</span>
// </div>
// <div class="flex items-baseline gap-sm">
// <span class="font-headline-lg text-headline-lg font-bold text-primary">10k+</span>
// <span class="font-body-md text-body-md text-on-surface-variant">Active Pipelines</span>
// </div>
// <p class="font-body-sm text-body-sm text-on-surface-variant mt-sm">
//                         Asynchronous I/O via Tokio allows thousands of concurrent HLS chunks to be processed and encrypted simultaneously.
//                     </p>
// </div>
// <!-- Metric 3 -->
// <div class="border border-outline-variant p-lg rounded-DEFAULT bg-surface-container-lowest flex flex-col gap-sm hover:border-primary transition-colors duration-200">
// <div class="flex items-center gap-sm">
// <span class="material-symbols-outlined text-secondary" data-icon="speed">speed</span>
// <span class="font-label-caps text-label-caps text-on-surface-variant">PROCESSING SPEED</span>
// </div>
// <div class="flex items-baseline gap-sm">
// <span class="font-headline-lg text-headline-lg font-bold text-primary">4.2x</span>
// <span class="font-body-md text-body-md text-on-surface-variant">Faster</span>
// </div>
// <p class="font-body-sm text-body-sm text-on-surface-variant mt-sm">
//                         Rust implementation outperforms equivalent Node.js pipelines by a factor of 4.2x in sustained throughput tests.
//                     </p>
// </div>
// </div>
// </section>
// </main>
// <!-- Footer -->
// <footer class="bg-surface-container-lowest border-t border-outline-variant w-full flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-md mt-auto">
// <div class="font-label-caps text-label-caps font-bold text-on-surface-variant mb-md md:mb-0">
//             © 2024 STREAMWEAVER INFRASTRUCTURE. ALL RIGHTS RESERVED.
//         </div>
// <div class="flex gap-lg">
// <a class="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors opacity-100" href="#">Terms</a>
// <a class="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors opacity-100" href="#">Privacy</a>
// <a class="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors opacity-100" href="#">Status</a>
// </div>
// </footer>
// </body></html>


// //this is for the pipeline section of landing page 
// <!DOCTYPE html>

// <html class="h-full" lang="en"><head>
// <meta charset="utf-8"/>
// <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
// <title>Streamweaver - Processing Workbench</title>
// <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
// <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&amp;family=Inter:wght@400;500;600&amp;family=JetBrains+Mono:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <script id="tailwind-config">
//         tailwind.config = {
//           darkMode: "class",
//           theme: {
//             extend: {
//               "colors": {
//                       "secondary-container": "#ffd07d",
//                       "secondary-fixed": "#ffdea8",
//                       "on-secondary-container": "#79570d",
//                       "surface-bright": "#f8f9ff",
//                       "primary-container": "#1b1b1b",
//                       "surface-dim": "#cbdbf5",
//                       "surface-tint": "#5e5e5e",
//                       "error": "#ba1a1a",
//                       "tertiary-fixed": "#e2e2e2",
//                       "on-primary-fixed": "#1b1b1b",
//                       "on-primary-container": "#848484",
//                       "on-secondary": "#ffffff",
//                       "outline-variant": "#cfc4c5",
//                       "inverse-primary": "#c6c6c6",
//                       "error-container": "#ffdad6",
//                       "surface-container-high": "#dce9ff",
//                       "surface": "#f8f9ff",
//                       "on-secondary-fixed-variant": "#5e4200",
//                       "on-tertiary-fixed": "#1b1b1b",
//                       "tertiary-container": "#1b1b1b",
//                       "surface-variant": "#d3e4fe",
//                       "on-error-container": "#93000a",
//                       "on-error": "#ffffff",
//                       "on-tertiary-container": "#848484",
//                       "surface-container-highest": "#d3e4fe",
//                       "secondary-fixed-dim": "#edc06e",
//                       "primary-fixed": "#e2e2e2",
//                       "outline": "#7e7576",
//                       "on-primary": "#ffffff",
//                       "inverse-on-surface": "#eaf1ff",
//                       "tertiary": "#000000",
//                       "tertiary-fixed-dim": "#c6c6c6",
//                       "on-tertiary-fixed-variant": "#474747",
//                       "background": "#f8f9ff",
//                       "on-surface": "#0b1c30",
//                       "primary-fixed-dim": "#c6c6c6",
//                       "on-primary-fixed-variant": "#474747",
//                       "on-surface-variant": "#4c4546",
//                       "surface-container-lowest": "#ffffff",
//                       "on-tertiary": "#ffffff",
//                       "inverse-surface": "#213145",
//                       "surface-container": "#e5eeff",
//                       "surface-container-low": "#eff4ff",
//                       "secondary": "#7a580f",
//                       "primary": "#000000",
//                       "on-secondary-fixed": "#271900",
//                       "on-background": "#0b1c30"
//               },
//               "borderRadius": {
//                       "DEFAULT": "1rem",
//                       "lg": "2rem",
//                       "xl": "3rem",
//                       "full": "9999px"
//               },
//               "spacing": {
//                       "gutter": "24px",
//                       "xl": "48px",
//                       "sm": "8px",
//                       "xs": "4px",
//                       "margin-desktop": "40px",
//                       "xxl": "80px",
//                       "lg": "24px",
//                       "md": "16px",
//                       "margin-mobile": "16px",
//                       "unit": "4px"
//               },
//               "fontFamily": {
//                       "label-caps": ["JetBrains Mono"],
//                       "body-md": ["Inter"],
//                       "display-hero": ["Bodoni Moda"],
//                       "headline-md": ["Bodoni Moda"],
//                       "headline-lg-mobile": ["Bodoni Moda"],
//                       "headline-lg": ["Bodoni Moda"],
//                       "body-sm": ["Inter"],
//                       "code-md": ["JetBrains Mono"],
//                       "body-lg": ["Inter"]
//               },
//               "fontSize": {
//                       "label-caps": ["12px", {"lineHeight": "1.0", "letterSpacing": "0.1em", "fontWeight": "500"}],
//                       "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
//                       "display-hero": ["72px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600"}],
//                       "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "500"}],
//                       "headline-lg-mobile": ["32px", {"lineHeight": "1.2", "fontWeight": "500"}],
//                       "headline-lg": ["40px", {"lineHeight": "1.2", "fontWeight": "500"}],
//                       "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
//                       "code-md": ["14px", {"lineHeight": "1.6", "fontWeight": "400"}],
//                       "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}]
//               }
//             }
//           }
//         }
//     </script>
// <style>
//         .material-symbols-outlined {
//             font-family: 'Material Symbols Outlined';
//             font-weight: normal;
//             font-style: normal;
//             font-size: 24px;
//             line-height: 1;
//             letter-spacing: normal;
//             text-transform: none;
//             display: inline-block;
//             white-space: nowrap;
//             word-wrap: normal;
//             direction: ltr;
//             -webkit-font-feature-settings: 'liga';
//             -webkit-font-smoothing: antialiased;
//         }
        
//         /* 1px Precision Lines for Clinical Aesthetic */
//         .border-precision {
//             border-width: 1px;
//             border-style: solid;
//             border-color: #E5E7EB;
//         }
//         .border-t-precision { border-top: 1px solid #E5E7EB; }
//         .border-b-precision { border-bottom: 1px solid #E5E7EB; }
//         .border-l-precision { border-left: 1px solid #E5E7EB; }
//         .border-r-precision { border-right: 1px solid #E5E7EB; }

//         .pipeline-line {
//             height: 1px;
//             background-color: #000000;
//             width: 100%;
//         }
        
//         .pulse-dot {
//             animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }

//         @keyframes pulse {
//             0%, 100% { opacity: 1; }
//             50% { opacity: .3; }
//         }
//     </style>
// </head>
// <body class="bg-surface-container-lowest text-on-surface h-full flex flex-col font-body-md overflow-x-hidden selection:bg-secondary-container selection:text-on-secondary-container">
// <!-- TopNavBar -->
// <header class="bg-surface-container-lowest dark:bg-surface-container-lowest flex justify-between items-center w-full px-margin-desktop py-4 mx-auto border-b border-outline-variant dark:border-outline z-50 sticky top-0">
// <div class="flex items-center gap-xl">
// <span class="font-headline-md text-headline-md tracking-tighter font-black text-primary dark:text-primary-fixed">STREAMWEAVER</span>
// <nav class="hidden md:flex gap-lg">
// <a class="text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors duration-200 cursor-pointer active:opacity-80 transition-opacity font-label-caps text-label-caps py-sm px-md" href="#">Streams</a>
// <a class="text-primary dark:text-primary-fixed border-b-2 border-secondary font-bold hover:bg-surface-container-low transition-colors duration-200 cursor-pointer active:opacity-80 transition-opacity font-label-caps text-label-caps py-sm px-md" href="#">Pipelines</a>
// <a class="text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors duration-200 cursor-pointer active:opacity-80 transition-opacity font-label-caps text-label-caps py-sm px-md" href="#">Infrastructure</a>
// <a class="text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors duration-200 cursor-pointer active:opacity-80 transition-opacity font-label-caps text-label-caps py-sm px-md" href="#">Logs</a>
// </nav>
// </div>
// <div class="flex items-center gap-md">
// <button class="bg-primary text-on-primary font-label-caps text-label-caps px-lg py-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer">Deploy</button>
// <button class="p-sm text-on-surface-variant hover:text-primary transition-colors">
// <span class="material-symbols-outlined" data-icon="settings">settings</span>
// </button>
// <button class="p-sm text-on-surface-variant hover:text-primary transition-colors">
// <span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
// </button>
// </div>
// </header>
// <div class="flex flex-1 overflow-hidden">
// <!-- Main Content Area -->
// <main class="flex-1 overflow-y-auto bg-surface-container-lowest p-margin-desktop lg:px-xxl flex flex-col gap-xxl w-full max-w-[1440px] mx-auto">
// <!-- Header Section -->
// <section class="flex justify-between items-end border-b-precision pb-md">
// <div>
// <h1 class="font-headline-lg text-headline-lg text-primary mb-sm">Processing Workbench</h1>
// <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">Active monitoring of VOD Pipeline Alpha. Real-time encryption and chunking operations in progress.</p>
// </div>
// <div class="flex items-center gap-sm">
// <div class="flex items-center gap-xs px-md py-xs border-precision rounded-full bg-surface-container-low">
// <div class="w-2 h-2 rounded-full bg-secondary pulse-dot"></div>
// <span class="font-label-caps text-label-caps text-primary">System Healthy</span>
// </div>
// </div>
// </section>
// <!-- Pipeline Visualization Container -->
// <section class="relative bg-surface-container-low border-precision p-xl min-h-[400px] flex items-center justify-center overflow-hidden">
// <!-- Background Grid for Clinical Feel -->
// <div class="absolute inset-0" style="background-image: linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px); background-size: 24px 24px; opacity: 0.3;"></div>
// <div class="relative z-10 w-full max-w-5xl flex items-center justify-between">
// <!-- Node: Input -->
// <div class="flex flex-col items-center gap-md relative">
// <div class="w-16 h-16 rounded-full border border-primary bg-surface-container-lowest flex items-center justify-center relative z-20">
// <span class="material-symbols-outlined text-primary" data-icon="login">login</span>
// </div>
// <span class="font-label-caps text-label-caps text-primary absolute -bottom-8 whitespace-nowrap">Source Ingestion</span>
// </div>
// <!-- Line -->
// <div class="flex-1 px-4 relative">
// <div class="pipeline-line"></div>
// <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container-lowest px-sm font-code-md text-code-md text-outline-variant">2.4 Gbps</div>
// </div>
// <!-- Node: Chunking -->
// <div class="flex flex-col items-center gap-md relative">
// <div class="w-16 h-16 rounded-full border border-primary bg-surface-container-lowest flex items-center justify-center relative z-20">
// <span class="material-symbols-outlined text-primary" data-icon="view_cozy">view_cozy</span>
// </div>
// <span class="font-label-caps text-label-caps text-primary absolute -bottom-8 whitespace-nowrap">HLS Chunking</span>
// </div>
// <!-- Line -->
// <div class="flex-1 px-4 relative">
// <div class="pipeline-line"></div>
// </div>
// <!-- Node: AES Encryption (ACTIVE) -->
// <div class="flex flex-col items-center gap-md relative">
// <!-- Active Ring Indicator -->
// <div class="absolute inset-0 border border-secondary rounded-full scale-125 animate-pulse"></div>
// <div class="w-20 h-20 rounded-full border-2 border-primary bg-secondary-container flex items-center justify-center relative z-20 shadow-[0_0_15px_rgba(255,208,125,0.4)]">
// <span class="material-symbols-outlined text-on-secondary-container" data-icon="lock" data-weight="fill" style="font-variation-settings: 'FILL' 1;">lock</span>
// </div>
// <span class="font-label-caps text-label-caps text-secondary absolute -bottom-10 whitespace-nowrap font-bold">AES-128 Encryption</span>
// </div>
// <!-- Line -->
// <div class="flex-1 px-4 relative">
// <div class="pipeline-line border-dashed border-t border-primary bg-transparent h-0"></div>
// <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container-lowest px-sm font-code-md text-code-md text-secondary pulse-dot">Processing</div>
// </div>
// <!-- Node: Assembly -->
// <div class="flex flex-col items-center gap-md relative">
// <div class="w-16 h-16 rounded-full border border-outline-variant bg-surface-container-lowest flex items-center justify-center relative z-20 opacity-50">
// <span class="material-symbols-outlined text-outline-variant" data-icon="data_object">data_object</span>
// </div>
// <span class="font-label-caps text-label-caps text-outline-variant absolute -bottom-8 whitespace-nowrap opacity-50">Manifest Assembly</span>
// </div>
// </div>
// </section>
// <!-- Active Node Details & Live Logs (Bento Layout) -->
// <div class="grid grid-cols-1 lg:grid-cols-3 gap-lg">
// <!-- Active Node Configuration panel -->
// <div class="lg:col-span-1 border-precision bg-surface-container-lowest p-xl">
// <h3 class="font-label-caps text-label-caps text-primary border-b-precision pb-sm mb-lg flex items-center justify-between">
//                         Configuration: AES-128
//                         <span class="material-symbols-outlined text-secondary text-sm" data-icon="radio_button_checked" data-weight="fill" style="font-variation-settings: 'FILL' 1;">radio_button_checked</span>
// </h3>
// <div class="flex flex-col gap-md">
// <div class="flex justify-between items-center border-b-precision pb-sm">
// <span class="font-body-sm text-body-sm text-on-surface-variant">Key Provider</span>
// <span class="font-code-md text-code-md text-primary">AWS KMS</span>
// </div>
// <div class="flex justify-between items-center border-b-precision pb-sm">
// <span class="font-body-sm text-body-sm text-on-surface-variant">Rotation Interval</span>
// <span class="font-code-md text-code-md text-primary">300s</span>
// </div>
// <div class="flex justify-between items-center border-b-precision pb-sm">
// <span class="font-body-sm text-body-sm text-on-surface-variant">Mode</span>
// <span class="font-code-md text-code-md text-primary">CBC</span>
// </div>
// <div class="flex justify-between items-center border-b-precision pb-sm">
// <span class="font-body-sm text-body-sm text-on-surface-variant">Throughput</span>
// <span class="font-code-md text-code-md text-secondary">1.2 GB/s</span>
// </div>
// <div class="mt-lg">
// <button class="w-full border-precision bg-surface-container-lowest text-primary font-label-caps text-label-caps px-md py-sm hover:bg-surface-container-low transition-colors cursor-pointer">Modify Key Settings</button>
// </div>
// </div>
// </div>
// <!-- Live Stream Log Ledger -->
// <div class="lg:col-span-2 border-precision bg-surface-container-lowest flex flex-col h-full max-h-[400px]">
// <div class="p-md border-b-precision flex justify-between items-center bg-surface-container-low">
// <h3 class="font-label-caps text-label-caps text-primary flex items-center gap-sm">
// <span class="material-symbols-outlined" data-icon="terminal">terminal</span>
//                             Process Ledger
//                         </h3>
// <div class="flex gap-sm">
// <span class="font-label-caps text-label-caps text-outline-variant text-[10px]">AUTO-SCROLL ON</span>
// </div>
// </div>
// <div class="p-md overflow-y-auto font-code-md text-code-md flex flex-col gap-xs flex-1">
// <!-- Log Entries -->
// <div class="flex gap-md py-xs border-b border-surface-container-high">
// <span class="text-outline-variant w-24 shrink-0">14:02:01.045</span>
// <span class="text-outline-variant w-16 shrink-0">[INFO]</span>
// <span class="text-on-surface-variant">Ingesting block 4A9B...</span>
// </div>
// <div class="flex gap-md py-xs border-b border-surface-container-high">
// <span class="text-outline-variant w-24 shrink-0">14:02:01.120</span>
// <span class="text-outline-variant w-16 shrink-0">[INFO]</span>
// <span class="text-on-surface-variant">Chunking complete for block 4A9B. Fragments generated: 12.</span>
// </div>
// <div class="flex gap-md py-xs border-b border-surface-container-high">
// <span class="text-outline-variant w-24 shrink-0">14:02:01.125</span>
// <span class="text-outline-variant w-16 shrink-0">[INFO]</span>
// <span class="text-on-surface-variant text-secondary">Initiating AES-128 CBC payload encryption...</span>
// </div>
// <div class="flex gap-md py-xs border-b border-surface-container-high">
// <span class="text-outline-variant w-24 shrink-0">14:02:01.450</span>
// <span class="text-primary font-bold w-16 shrink-0">[SUCCESS]</span>
// <span class="text-primary font-bold">Encryption validated for block 4A9B. IV stored.</span>
// </div>
// <div class="flex gap-md py-xs border-b border-surface-container-high">
// <span class="text-outline-variant w-24 shrink-0">14:02:02.010</span>
// <span class="text-outline-variant w-16 shrink-0">[INFO]</span>
// <span class="text-on-surface-variant">Ingesting block 4A9C...</span>
// </div>
// <div class="flex gap-md py-xs border-b border-surface-container-high">
// <span class="text-outline-variant w-24 shrink-0">14:02:02.085</span>
// <span class="text-outline-variant w-16 shrink-0">[INFO]</span>
// <span class="text-on-surface-variant">Chunking complete for block 4A9C. Fragments generated: 12.</span>
// </div>
// <div class="flex gap-md py-xs border-b border-surface-container-high">
// <span class="text-outline-variant w-24 shrink-0">14:02:02.090</span>
// <span class="text-outline-variant w-16 shrink-0">[INFO]</span>
// <span class="text-on-surface-variant text-secondary pulse-dot">Initiating AES-128 CBC payload encryption...</span>
// </div>
// </div>
// </div>
// </div>
// </main>
// </div>
// </body></html>


