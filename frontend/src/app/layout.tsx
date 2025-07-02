/* eslint-disable perfectionist/sort-imports */
import "src/global.css";

// i18n
import "src/locales/i18n";

// ----------------------------------------------------------------------

import { LocalizationProvider } from "src/locales";
import ThemeProvider from "src/theme";
import { primaryFont } from "src/theme/typography";

import { MotionLazy } from "src/components/animate/motion-lazy";
import ProgressBar from "src/components/progress-bar";
import { SettingsDrawer, SettingsProvider } from "src/components/settings";
import SnackbarProvider from "src/components/snackbar/snackbar-provider";

import { Toaster } from "sonner";
import { AuthProvider } from "src/auth/context/jwt";
import { ClerkAuthProvider } from "@/auth/context/clerk";
import ActiveListener from "@/redux/ActiveListener";
import { ReduxProvider } from "@/redux/ReduxProvider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import AudioPlayer from "./audio-player";
// import { AuthProvider } from 'src/auth/context/auth0';
// import { AuthProvider } from 'src/auth/context/amplify';
// import { AuthProvider } from 'src/auth/context/firebase';
// import { AuthProvider } from 'src/auth/context/supabase';

// ----------------------------------------------------------------------

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "Talk Now!",
  description:
    "The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style",
  keywords: "react,material,kit,application,dashboard,admin,template",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon/favicon-16x16.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon/favicon-32x32.png" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon/apple-touch-icon.png" },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <ConvexClientProvider>
          <AuthProvider>
            <LocalizationProvider>
              <Toaster position="top-center" />
              <SettingsProvider
                defaultSettings={{
                  themeMode: "light", // 'light' | 'dark'
                  themeDirection: "ltr", //  'rtl' | 'ltr'
                  themeContrast: "default", // 'default' | 'bold'
                  themeLayout: "vertical", // 'vertical' | 'horizontal' | 'mini'
                  themeColorPresets: "default", // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                  themeStretch: false,
                }}
              >
                <ThemeProvider>
                  <ReduxProvider>
                    <MotionLazy>
                      <SnackbarProvider>
                        {/* <CheckoutProvider> */}
                        <SettingsDrawer />
                        <ProgressBar />
                        <ClerkAuthProvider>
                          <ActiveListener>{children} </ActiveListener>
                        </ClerkAuthProvider>
                        <AudioPlayer />
                        {/* </CheckoutProvider> */}
                      </SnackbarProvider>
                    </MotionLazy>
                  </ReduxProvider>
                </ThemeProvider>
              </SettingsProvider>
            </LocalizationProvider>
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
