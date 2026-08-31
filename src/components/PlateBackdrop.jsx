import { useEffect, useState } from 'react';

// Kage's persistent scene-plate layer: a fixed full-viewport backdrop
// that swaps its image per active chapter with a slow cross-fade. Each
// plate has its own composition (position/scale) so it doesn't clash
// with the DOM copy layout for that chapter.
//
// Plates are declared as an ordered list — one per chapter index. Missing
// entries render as null (chapter has no plate yet, leaving the base
// #ink background visible), which is how we can ship progressively as
// GPT-generated plates arrive.

const CROSSFADE_MS = 900;
// Clamp how far within-chapter scroll can push a background layer — long
// chapters shouldn't drag the far/mid/near planes off past a subtle drift.
const MAX_PARALLAX_PX = 140;

export default function PlateBackdrop({ plates, activeIndex, sceneOffset = 0 }) {
  const [current, setCurrent] = useState(activeIndex);
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    if (activeIndex === current) return;
    setPrev(current);
    setCurrent(activeIndex);
    const t = setTimeout(() => setPrev(null), CROSSFADE_MS);
    return () => clearTimeout(t);
  }, [activeIndex, current]);

  const currentPlate = plates[current];
  const prevPlate = prev !== null ? plates[prev] : null;

  return (
    <div className="plate-backdrop" aria-hidden="true">
      {prevPlate && <PlateImage key={`prev-${prev}`} plate={prevPlate} state="out" sceneOffset={0} />}
      {currentPlate && <PlateImage key={`cur-${current}`} plate={currentPlate} state="in" sceneOffset={sceneOffset} />}
    </div>
  );
}

function PlateImage({ plate, state, sceneOffset }) {
  const { src, anchor = 'right', scale = 1, layers } = plate;
  const cls = `plate plate--${anchor} plate--${state}`;
  return (
    <div className={cls}>
      {layers && layers.map((layer, i) => {
        const drift = Math.max(-MAX_PARALLAX_PX, Math.min(MAX_PARALLAX_PX, sceneOffset * layer.speed));
        const zoom = layer.scale ?? 1;
        // Depth-of-field cue: layers further back read softer and smaller,
        // near layers stay sharp and slightly larger — sells the parallax
        // as actual distance, not just three flat images sliding at
        // different speeds.
        const filter = `saturate(1.08)${layer.blur ? ` blur(${layer.blur}px)` : ''}`;
        return (
          <div
            className="bg-layer"
            key={layer.src}
            style={{
              zIndex: i,
              opacity: layer.opacity ?? 1,
              transform: `translateY(${drift}px) scale(${zoom})`
            }}
          >
            <img src={layer.src} style={{ filter }} alt="" />
          </div>
        );
      })}
      {src && <img className="plate-img" src={src} style={{ '--s': scale }} alt="" />}
    </div>
  );
}
