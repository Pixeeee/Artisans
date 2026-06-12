"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function SmartArtsLink({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Link className={className} href="/arts">
      {children}
    </Link>
  );
}
