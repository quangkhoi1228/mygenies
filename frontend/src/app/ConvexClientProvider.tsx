"use client";

import { useAuth, ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

import { Authenticated, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import { ErrorBoundary } from "./ErrorBoundary";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  return (
    <ErrorBoundary>
      <ClerkProvider appearance={{ baseTheme: undefined }}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <Authenticated>
            <span />
            {/* <StoreUserInDatabase /> */}
          </Authenticated>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

// function StoreUserInDatabase() {
//   const { user } = useUser();
//   const storeUser = useMutation(api.users.store);
//   useEffect(() => {
//     storeUser();
//   }, [storeUser, user?.id]);
//   return null;
// }
