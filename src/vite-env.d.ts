/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_LUCIDFLOW_ENQUIRY_ENDPOINT?: string;
  readonly VITE_CALENDAR_BOOKING_URL?: string;
  readonly VITE_SITE_URL?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
