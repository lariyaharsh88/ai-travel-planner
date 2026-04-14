import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.epicindiatrips.planner",
  appName: "EpicIndiaTrips",
  /** Bundled web assets (tracked). `out/` is reserved for Next static export and is gitignored. */
  webDir: "www",
  /**
   * Next.js keeps `/api/*` on the server, so a full static `out` export is not used here by default.
   * For Android dev: run `npm run dev`, then set `server.url` to your machine IP + :3000 (or use
   * `http://10.0.2.2:3000` from the emulator to reach the host). Uncomment and adjust:
   */
  // server: {
  //   url: "http://10.0.2.2:3000",
  //   cleartext: true,
  // },
};

export default config;
