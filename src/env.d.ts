import "@opennextjs/cloudflare";

interface CloudflareEnv {
  DB: D1Database;
}

declare module "@opennextjs/cloudflare" {
  interface CloudflareContext {
    env: CloudflareEnv;
  }
  export function getCloudflareContext(): Promise<CloudflareContext>;
  export function initOpenNextCloudflareForDev(): Promise<void>;
}
