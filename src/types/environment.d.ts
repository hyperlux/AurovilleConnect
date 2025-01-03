/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: 'development' | 'production'
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
  readonly BASE_URL: string
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Ensure this file is treated as a module
export {}
