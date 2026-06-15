// //this is the auth page 
// //it has some css issues need to be fixed 
// <!DOCTYPE html><html class="light" lang="en" style=""><head>
// <meta charset="utf-8">
// <meta content="width=device-width, initial-scale=1.0" name="viewport">
// <title>Streamweaver | Authenticate</title>
// <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
// <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&amp;family=Inter:wght@100..900&amp;family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&amp;display=swap" rel="stylesheet">
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
// <script id="tailwind-config">
//         tailwind.config = {
//           darkMode: "class",
//           theme: {
//             extend: {
//               "colors": {
//                       "secondary-fixed-dim": "#edc06e",
//                       "inverse-surface": "#213145",
//                       "outline-variant": "#cfc4c5",
//                       "primary": "#000000",
//                       "surface-container-high": "#dce9ff",
//                       "on-surface-variant": "#4c4546",
//                       "surface-container-highest": "#d3e4fe",
//                       "on-error": "#ffffff",
//                       "surface-container-low": "#eff4ff",
//                       "secondary": "#7a580f",
//                       "on-tertiary-fixed-variant": "#474747",
//                       "on-secondary-fixed": "#271900",
//                       "on-tertiary-fixed": "#1b1b1b",
//                       "on-error-container": "#93000a",
//                       "inverse-on-surface": "#eaf1ff",
//                       "error-container": "#ffdad6",
//                       "on-background": "#0b1c30",
//                       "on-secondary-fixed-variant": "#5e4200",
//                       "tertiary-fixed": "#e2e2e2",
//                       "secondary-fixed": "#ffdea8",
//                       "on-surface": "#0b1c30",
//                       "primary-fixed-dim": "#c6c6c6",
//                       "surface-tint": "#5e5e5e",
//                       "surface": "#f8f9ff",
//                       "surface-variant": "#d3e4fe",
//                       "surface-container-lowest": "#ffffff",
//                       "secondary-container": "#ffd07d",
//                       "tertiary-fixed-dim": "#c6c6c6",
//                       "on-secondary-container": "#79570d",
//                       "primary-fixed": "#e2e2e2",
//                       "error": "#ba1a1a",
//                       "on-tertiary": "#ffffff",
//                       "background": "#f8f9ff",
//                       "primary-container": "#1b1b1b",
//                       "on-primary-container": "#848484",
//                       "outline": "#7e7576",
//                       "on-primary-fixed": "#1b1b1b",
//                       "inverse-primary": "#c6c6c6",
//                       "surface-container": "#e5eeff",
//                       "on-primary": "#ffffff",
//                       "on-primary-fixed-variant": "#474747",
//                       "tertiary-container": "#1b1b1b",
//                       "on-secondary": "#ffffff",
//                       "surface-dim": "#cbdbf5",
//                       "tertiary": "#000000",
//                       "surface-bright": "#f8f9ff",
//                       "on-tertiary-container": "#848484"
//               },
//               "borderRadius": {
//                       "DEFAULT": "1rem",
//                       "lg": "2rem",
//                       "xl": "3rem",
//                       "full": "9999px",
//                       "none": "0px"
//               },
//               "spacing": {
//                       "gutter": "24px",
//                       "md": "16px",
//                       "xs": "4px",
//                       "xl": "48px",
//                       "unit": "4px",
//                       "xxl": "80px",
//                       "margin-mobile": "16px",
//                       "lg": "24px",
//                       "sm": "8px",
//                       "margin-desktop": "40px"
//               },
//               "fontFamily": {
//                       "headline-lg": [
//                               "Bodoni Moda"
//                       ],
//                       "code-md": [
//                               "JetBrains Mono"
//                       ],
//                       "headline-md": [
//                               "Bodoni Moda"
//                       ],
//                       "body-sm": [
//                               "Inter"
//                       ],
//                       "label-caps": [
//                               "JetBrains Mono"
//                       ],
//                       "body-md": [
//                               "Inter"
//                       ],
//                       "headline-lg-mobile": [
//                               "Bodoni Moda"
//                       ],
//                       "display-hero": [
//                               "Bodoni Moda"
//                       ],
//                       "body-lg": [
//                               "Inter"
//                       ]
//               },
//               "fontSize": {
//                       "headline-lg": [
//                               "40px",
//                               {
//                                       "lineHeight": "1.2",
//                                       "fontWeight": "500"
//                               }
//                       ],
//                       "code-md": [
//                               "14px",
//                               {
//                                       "lineHeight": "1.6",
//                                       "fontWeight": "400"
//                               }
//                       ],
//                       "headline-md": [
//                               "24px",
//                               {
//                                       "lineHeight": "1.3",
//                                       "fontWeight": "500"
//                               }
//                       ],
//                       "body-sm": [
//                               "14px",
//                               {
//                                       "lineHeight": "1.5",
//                                       "fontWeight": "400"
//                               }
//                       ],
//                       "label-caps": [
//                               "12px",
//                               {
//                                       "lineHeight": "1.0",
//                                       "letterSpacing": "0.1em",
//                                       "fontWeight": "500"
//                               }
//                       ],
//                       "body-md": [
//                               "16px",
//                               {
//                                       "lineHeight": "1.5",
//                                       "fontWeight": "400"
//                               }
//                       ],
//                       "headline-lg-mobile": [
//                               "32px",
//                               {
//                                       "lineHeight": "1.2",
//                                       "fontWeight": "500"
//                               }
//                       ],
//                       "display-hero": [
//                               "72px",
//                               {
//                                       "lineHeight": "1.1",
//                                       "letterSpacing": "-0.02em",
//                                       "fontWeight": "600"
//                               }
//                       ],
//                       "body-lg": [
//                               "18px",
//                               {
//                                       "lineHeight": "1.6",
//                                       "fontWeight": "400"
//                               }
//                       ]
//               }
//       },
//           },
//         }
//       </script>
// <style>
//         .dot-grid {
//             background-image: radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px);
//             background-size: 24px 24px;
//         }
        
//         .clinical-input:focus {
//             border-bottom-color: #7a580f; /* secondary color from config */
//             outline: none;
//             box-shadow: none;
//         }
//     </style>
// </head>
// <body class="bg-[#FFFFFF] min-h-screen flex items-center justify-center font-body-md text-on-surface"><div class="fixed inset-0 pointer-events-none z-0">
// <div class="absolute left-1/4 top-0 bottom-0 w-[1px] bg-gray-200"></div>
// <div class="absolute left-3/4 top-0 bottom-0 w-[1px] bg-gray-200"></div>
// <div class="absolute top-1/3 left-0 right-0 h-[1px] bg-gray-200"></div>
// <div class="absolute top-2/3 left-0 right-0 h-[1px] bg-gray-200"></div>
// <div class="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-full pb-1 font-mono text-[10px] text-gray-400 whitespace-nowrap">
//     X:25 Y:33
//   </div>
// </div>
// <!-- Container -->
// <main class="w-full max-w-[400px] px-margin-mobile md:px-0 flex flex-col items-center relative z-10"><div class="bg-transparent shadow-none flex flex-col items-center">
//     <div class="font-label-caps text-[12px] tracking-[0.2em] text-primary font-bold uppercase mb-xl text-center">
//         STREAMWEAVER
//     </div>
//     <h1 class="font-headline-md text-[30px] text-primary mb-sm text-center">
//         System Authentication
//     </h1>
//     <p class="font-code-md text-[12px] text-gray-400 text-center mb-xl">
//         Awaiting operator credentials...
//     </p>
//     <form action="#" class="w-full flex flex-col" method="POST"><div class="space-y-6">
//     <div class="relative w-full">
//         <input type="text" placeholder="Operator ID" class="w-full bg-transparent border-0 border-b border-gray-300 rounded-none shadow-none placeholder:font-mono text-sm placeholder:text-gray-400 focus:border-black focus:ring-0 outline-none transition-colors duration-200" required="">
//     </div>
//     <div class="relative w-full">
//         <input type="password" placeholder="Passphrase" class="w-full bg-transparent border-0 border-b border-gray-300 rounded-none shadow-none placeholder:font-mono text-sm placeholder:text-gray-400 focus:border-black focus:ring-0 outline-none transition-colors duration-200" required="">
//     </div>
// </div>
// <button class="mt-md w-full bg-primary text-on-primary font-body-md text-body-md rounded-none py-3 px-6 hover:bg-opacity-90 active:bg-opacity-100 transition-all duration-200" type="submit">
//     Initialize Session
// </button></form>
// </div></main>


// </body></html>