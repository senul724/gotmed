"use client";

import { env } from "@/env";
import { useJsApiLoader } from "@react-google-maps/api";
import { ReactNode } from "react";

export function MapProvider({ children }: { children: ReactNode }) {
  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });

  if (loadError) {
    // add error screen here
    return (
      <h1>
        Encountered error while loading google maps
      </h1>
    );
  }

  // add loading screen here
  if (!scriptLoaded) return "Map loading...";

  return children;
}
