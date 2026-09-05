/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAPIDAPI_KEY?: string;
  readonly VITE_RAPIDAPI_HOST?: string;
  readonly VITE_BASE_PATH?: string;
  [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.jsx" {
  import type { ComponentType } from "react";
  const component: ComponentType<any>;
  export default component;
}
