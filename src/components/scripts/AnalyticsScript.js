"use client";

import { useEffect } from "react";
export const AnalyticsScript = () => {
  useEffect(() => {
    const loadScript = (src, onLoad) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = onLoad;
      document.body.appendChild(script);
    };
    loadScript(
      "https://cdn.amplitude.com/libs/analytics-browser-2.6.2-min.js.gz",
      () => {
        loadScript(
          "https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.1.9-min.js.gz",
          () => {
            loadScript(
              "https://cdn.amplitude.com/libs/plugin-autocapture-browser-0.9.0-min.js.gz",
              () => {
                window.amplitude.init("425f962814654a360336027483e38b8f");
                window.amplitude.add(
                  window.sessionReplay.plugin({ sampleRate: 1 })
                );
                window.amplitude.add(
                  window.amplitudeAutocapturePlugin.plugin()
                );
              }
            );
          }
        );
      }
    );
  }, []);
  return null;
};