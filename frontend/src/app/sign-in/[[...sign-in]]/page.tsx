import { SignIn } from "@clerk/nextjs";

/* ═══════════════════════════════════════════════════════
   Streamweaver Auth Page
   Centered authentication form with clinical aesthetic.
   Integrated with Clerk <SignIn /> component.
   ═══════════════════════════════════════════════════════ */

export default function SignInPage() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* ─── Blueprint background lines ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-gray-200"></div>
        <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-gray-200"></div>
        <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gray-200"></div>
        <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-gray-200"></div>
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-full pb-1 font-mono text-[10px] text-gray-400 whitespace-nowrap">
          X:25 Y:33
        </div>
      </div>

      {/* ─── Auth Container (centered) ─── */}
      <main className="w-full max-w-[400px] px-4 md:px-0 flex flex-col items-center relative z-10">
        <div className="w-full flex flex-col items-center">
          {/* Brand */}
          <div className="font-label-caps text-[12px] tracking-[0.2em] text-primary font-bold uppercase mb-8 text-center">
            STREAMWEAVER
          </div>

          {/* Heading */}
          <h1 className="font-headline-md text-[30px] text-primary mb-2 text-center">
            System Authentication
          </h1>

          {/* Subtext */}
          <p className="font-code-md text-[12px] text-gray-400 text-center mb-8">
            Awaiting operator credentials...
          </p>

          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none w-full p-0 flex flex-col gap-6",
                headerTitle: "hidden", 
                headerSubtitle: "hidden", 
                socialButtonsBlockButton: "rounded-none border border-gray-300 font-mono text-sm shadow-none",
                socialButtonsBlockButtonText: "font-mono font-bold",
                dividerLine: "bg-gray-200",
                dividerText: "font-mono text-gray-400 text-xs uppercase tracking-widest",
                formFieldLabel: "font-mono text-[10px] text-gray-500 uppercase tracking-wider",
                formFieldInput: "w-full bg-transparent border-0 border-b border-gray-300 rounded-none shadow-none font-mono text-sm placeholder:text-gray-400 text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors duration-200 py-2",
                formButtonPrimary: "mt-6 w-full bg-primary text-on-primary font-body-md rounded-none py-3 px-6 hover:opacity-90 active:opacity-100 transition-all duration-200 shadow-none",
                footerActionText: "font-mono text-xs text-gray-500",
                footerActionLink: "font-mono text-xs text-primary hover:text-primary hover:underline",
                identityPreviewText: "font-mono text-sm text-gray-600",
                identityPreviewEditButtonIcon: "text-primary",
                formFieldSuccessIcon: "text-primary",
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}
