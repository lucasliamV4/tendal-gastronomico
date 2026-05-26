type TrackPayload = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, payload: TrackPayload = {}) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", name, payload);
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", name, payload);
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...payload });
    }
    if (import.meta.env.DEV) {
      console.debug("[track]", name, payload);
    }
  } catch (e) {
    // silencioso de proposito
  }
}
