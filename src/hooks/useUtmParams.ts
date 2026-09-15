import { useEffect, useState } from "react";

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const UTM_KEYS: Array<keyof UtmParams> = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

const STORAGE_KEY = "lucidflow_utm_params";

function extractUtmFromUrl(): UtmParams {
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utm[key] = value;
    }
  });

  return utm;
}

function loadStoredUtm(): UtmParams {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function storeUtm(utm: UtmParams): void {
  try {
    if (Object.keys(utm).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    }
  } catch {
    // Silently fail if sessionStorage is not available
  }
}

export function useUtmParams(): UtmParams {
  const [utmParams, setUtmParams] = useState<UtmParams>({});

  useEffect(() => {
    const urlUtm = extractUtmFromUrl();
    const storedUtm = loadStoredUtm();

    // URL params take precedence over stored params
    const merged = { ...storedUtm, ...urlUtm };

    // Store the merged params
    storeUtm(merged);

    setUtmParams(merged);
  }, []);

  return utmParams;
}

export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  
  const urlUtm = extractUtmFromUrl();
  const storedUtm = loadStoredUtm();
  
  return { ...storedUtm, ...urlUtm };
}
