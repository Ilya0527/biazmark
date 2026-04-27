import type { CapacitorConfig } from "@capacitor/cli";

/**
 * AutoCMO mobile app — two modes:
 *
 *   1. Remote (default):  loads the live deployment at autocmo.app.
 *      Set AUTOCMO_URL to override (e.g. for staging).
 *
 *   2. Bundled:  if AUTOCMO_STATIC=1, Capacitor serves a static export that the
 *      /frontend/scripts/build-mobile.sh script produces in /mobile/www.
 *
 * The legacy BIAZMARK_URL / BIAZMARK_STATIC env vars are still honoured for
 * compatibility with old build scripts.
 */

const REMOTE_URL =
  process.env.AUTOCMO_URL ||
  process.env.BIAZMARK_URL ||
  "https://autocmo.app";

const STATIC =
  process.env.AUTOCMO_STATIC === "1" || process.env.BIAZMARK_STATIC === "1";

const config: CapacitorConfig = {
  appId: "com.autocmo.app",
  appName: "AutoCMO",
  webDir: "www",
  backgroundColor: "#0b0d12",
  server: STATIC
    ? undefined
    : {
        url: REMOTE_URL,
        cleartext: false,
        allowNavigation: [
          "autocmo.app",
          "*.autocmo.app",
          "*.vercel.app",
          "*.onrender.com",
          "*.anthropic.com",
          "graph.facebook.com",
          "api.linkedin.com",
          "api.twitter.com",
          "open.tiktokapis.com",
          "googleads.googleapis.com",
          "api.resend.com",
        ],
      },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#0b0d12",
      showSpinner: false,
      androidSplashResourceName: "splash",
      iosSplashResourceName: "Splash",
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0b0d12",
      overlaysWebView: false,
    },
    Preferences: {
      group: "AutoCMOPrefs",
    },
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
    backgroundColor: "#0b0d12",
  },
  ios: {
    contentInset: "automatic",
    scrollEnabled: true,
    backgroundColor: "#0b0d12",
  },
};

export default config;
