"use client";

import { useEffect, useState } from "react";
import { BrandCube } from "./brand-cube";

export function HomeLoader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHidden(true), 3300);
    return () => window.clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div className="home-loader" aria-label="Loading ArtisanS home">
      <BrandCube className="loader-icon h-24 w-24" />
    </div>
  );
}
