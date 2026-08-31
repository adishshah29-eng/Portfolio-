import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const RETIRE_MS = 820;

// One chapter's near-plane scenery piece. While `active`, it's portaled into
// the fixed foreground host, fully opaque, settled at its anchored position.
// When the chapter loses ownership it keeps rendering for RETIRE_MS with a
// "retiring" class (fade + blur) before unmounting — matching Kage's
// foreground-retirement timing.
export default function ForegroundPlate({ host, active, anchor = 'bottom-right', children }) {
  const [mounted, setMounted] = useState(active);
  const [retiring, setRetiring] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (active) {
      clearTimeout(timerRef.current);
      setRetiring(false);
      setMounted(true);
    } else if (mounted) {
      setRetiring(true);
      timerRef.current = setTimeout(() => {
        setMounted(false);
        setRetiring(false);
      }, RETIRE_MS);
    }
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!host || !mounted) return null;

  const cls = `fg-plate fg-plate--${anchor}${active && !retiring ? ' is-active' : ''}${retiring ? ' is-retiring' : ''}`;

  return createPortal(<div className={cls}>{children}</div>, host);
}
