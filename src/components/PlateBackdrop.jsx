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

export default function PlateBackdrop({ plates, activeIndex }) {
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
      {prevPlate && <PlateImage key={`prev-${prev}`} plate={prevPlate} state="out" />}
      {currentPlate && <PlateImage key={`cur-${current}`} plate={currentPlate} state="in" />}
    </div>
  );
}

function PlateImage({ plate, state }) {
  const { src, anchor = 'right', scale = 1 } = plate;
  const cls = `plate plate--${anchor} plate--${state}`;
  return (
    <div className={cls}>
      <img src={src} alt="" style={{ transform: `scale(${scale})` }} />
    </div>
  );
}
