"use client";

import { useEffect } from "react";

export default function SiteVisitTracker() {
  useEffect(() => {
    // Only track once per session on the client
    const hasTracked = sessionStorage.getItem("site_visit_tracked");
    if (!hasTracked) {
      fetch("/api/track", { method: "POST" })
        .then(() => sessionStorage.setItem("site_visit_tracked", "true"))
        .catch(console.error);
    }
  }, []);

  return null;
}
