import { useEffect, useState } from "react";

export type IconTreeMode = "static" | "hover" | "loop" | "onClick";

/**
 * IconTree icons render their static first frame in SSR and only become
 * interaction-driven after mount, so reduced-motion users never see playback.
 */
export function useIconMotion(): IconTreeMode {
  const [mode, setMode] = useState<IconTreeMode>("static");
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("hover");
    }
  }, []);
  return mode;
}
