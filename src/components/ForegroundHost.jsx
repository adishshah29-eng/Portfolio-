import { useLayoutEffect, useRef, useState } from 'react';

// The fixed near-plane host every active chapter's foreground plate portals
// into — Kage's "foreground ownership" pattern: a decorative piece lives in
// its section while parked, then re-parents to one fixed host outside the
// page stacking context when its chapter becomes active.
//
// The host ref only attaches to a real DOM node after the FIRST commit, so
// `host` is unavoidably null for that first render — useLayoutEffect (not
// useEffect) just gets it converged before the browser paints, instead of
// after. Anything portaling into this host that runs its own one-time setup
// keyed to "is a host available yet" needs that in its effect dependencies,
// not an empty array, or it'll configure the wrong (pre-host) DOM node.
export function useForegroundHost() {
  const [host, setHost] = useState(null);
  const ref = useRef(null);
  useLayoutEffect(() => {
    setHost(ref.current);
  }, []);
  return { hostRef: ref, host };
}

export default function ForegroundHost({ hostRef }) {
  return <div id="foreground-host" className="foreground-host" ref={hostRef} aria-hidden="true" />;
}
