/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  as;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
