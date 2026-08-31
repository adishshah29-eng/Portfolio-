import { useEffect, useRef, useState } from 'react';

// The fixed near-plane host every active chapter's foreground plate portals
// into — Kage's "foreground ownership" pattern: a decorative piece lives in
// its section while parked, then re-parents to one fixed host outside the
// page stacking context when its chapter becomes active.
export function useForegroundHost() {
  const [host, setHost] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    setHost(ref.current);
  }, []);
  return { hostRef: ref, host };
}

export default function ForegroundHost({ hostRef }) {
  return <div id="foreground-host" className="foreground-host" ref={hostRef} aria-hidden="true" />;
}
