"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-16 h-16 object-contain" }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <img
      src={mounted && resolvedTheme === "dark" ? "/funeslogo.png" : "/funeslogo.png"}
      alt="funes"
      className={className}
    />
  );
}

export default Logo;