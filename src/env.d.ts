/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_CLOUD_API_KEY: string;
  readonly VITE_GOOGLE_CLOUD_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 