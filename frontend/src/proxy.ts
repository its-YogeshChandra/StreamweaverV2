import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const authObj = await auth();
  console.log("Auth state:", JSON.stringify({
    isAuthenticated: authObj.isAuthenticated,
    userId: authObj.userId,
    sessionId: authObj.sessionId,
  }));
  console.log("Auth debug:", authObj.debug());
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
}, { debug: true });

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    '/__clerk/:path*'
  ],
};
