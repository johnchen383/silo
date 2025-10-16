/// <reference types="vite/client" />

declare module 'virtual:pwa-register' {
  export function registerSW(options?: { immediate?: boolean }): void
}

declare const __COMMIT_HASH__: string;

declare module '@tanstack/query-async-storage-persister';