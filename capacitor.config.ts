import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.netherway.app",
  appName: "Netherway",

  server: {
    url: "https://netherlands-guide.vercel.app",
    cleartext: false,
  },

  ios: {
    contentInset: "automatic",
  },

  plugins: {
    SplashScreen: {
      launchAutoHide: true,
    },
  },
};

export default config;