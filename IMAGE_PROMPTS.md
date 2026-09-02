# GPT Image Prompts — Molten Chrome Editorial

Rewritten set. Two changes from the first pass:

1. Chrome typography now spells **ADISH** (five letters), not AS.
2. Every chapter now has a **3-layer background stack** (far / mid / near) instead of a single flat plate — this is what gives Kage its parallax depth. The layers sit behind the DOM copy and move at different scroll speeds (far layer barely moves, near layer moves fastest), so stack them in this exact far→near order per chapter.

Filenames below are the convention to save as — keep them so wiring them into `PlateBackdrop`/`App.jsx` is a straight drop-in.

---

## Style bible (paste-ready, prepend to every prompt below)

> Cinematic AI-surrealist poster art, molten liquid chrome and brushed titanium forms, Y2K futurism, cyber-surrealist mood, dark near-black studio environment (#05070a), single dramatic key light with warm vermilion (#e0231c) and gold (#c9a24a) rim light, subtle amber/ember (#ff5a3c) reflections, ultra high detail render quality like Cinema4D + Octane / Blender studio render, shot on a wide-angle anamorphic lens, heavy film grain, moody volumetric haze, no text or logos unless specified, no people, 4K poster composition.

---

## Chapter 01 — BOOT (hero) — REVISED (round 2)

**Concept change**: the plate no longer spells any name — it's now a pure abstract composition of chrome fragments assembling/exploding. The DOM already has "Adish Shah" as the real h1, so the image doesn't need to repeat it; this also fixes the redundancy of seeing the name twice. The far background layer is unchanged (it read fine); mid and near are rewritten because the first pass came back as near-duplicate skies with no real silhouette/foreground content, so the parallax stack had nothing to separate — regenerate these two. The foreground cutout is rewritten to visually belong to the plate (a fragment breaking off it) instead of a random floating teardrop.

### bg-boot-far.webp — KEEP, no regen needed
Already shipped and working; leave as-is.

### bg-boot-mid.webp (ridge/structure plane) — REGENERATE
> [style bible] + A wide silhouetted skyline made of tall jagged broken monolith shapes and shard-like spires of varying heights, evenly spread across the full width of frame, completely backlit so only a thin vermilion rim line traces each shape's silhouette against the near-black sky, everything inside each silhouette pure flat black with no visible surface detail, horizontal 21:9 composition, no readable text, the shapes must be clearly readable as distinct solid silhouettes (not a soft glow gradient like the far layer).

### bg-boot-near.webp (fog/particle plane) — REGENERATE
> [style bible] + Dense drifting fog volumes and a scatter of glowing metallic dust motes photographed close to camera, individual embers and sparks clearly visible as bright pinpoints with soft bloom, fog rolling low across the bottom third of frame, top two-thirds mostly clear/empty, horizontal 21:9 composition, shot with shallow depth of field so a few near motes are large and slightly out of focus — this layer should feel physically close to the camera, not another distant sky.

### plate-01-boot.webp (hero scene plate) — REGENERATE, new concept
> [style bible] + A dense cluster of dozens of irregular liquid-chrome shards and fragments caught mid-air as if exploding outward from, or coalescing into, a central point — no readable text, no symbol, no letterforms anywhere in the frame, fragments of wildly varying size tumbling and overlapping in space, strong vermilion and gold rim light catching every fragment edge, dense fragment cluster anchored to the right two-thirds of frame with the left third left dark/empty for text overlay, sense of violent motion and energy, hyper-detailed metal reflections, cinematic wide shot.

### fg-boot-shard.webp (foreground cutout) — REGENERATE, tied to the plate
> [style bible] + A single large liquid-chrome shard captured mid-flight as if it just broke away from a larger fractured mass off-frame, trailing two or three smaller droplet fragments behind it like a comet tail, clear sense of directional motion (flying up and to the left), dramatic rim lighting on the curved metal edge, background pure near-black so it isolates cleanly, vertical portrait composition, generous empty margin around the shard for cropping.

---

## Chapter 02 — STACK (skills / education)

**Concept**: layered strata — glass and chrome plates stacked like geological sediment, representing the technical stack.

### bg-stack-far.webp
> [style bible] + Faint horizontal bands of gold and vermilion light suspended in near-black void like distant stacked strata, extremely soft focus, almost abstract gradient, horizontal 21:9, pure atmosphere with nothing in sharp focus.

### bg-stack-mid.webp
> [style bible] + Wide silhouette of thin horizontal chrome plates stacked like sediment layers receding into haze, each plate edge catching a thin line of warm rim light, horizontal 21:9 composition, left half of frame kept emptier/darker for text overlay.

### bg-stack-near.webp
> [style bible] + Close drifting shards of glass and metal dust suspended mid-air, softly out of focus, warm highlights only, mostly negative space, horizontal 21:9, denser toward the right edge of frame.

### plate-02-stack.webp (scene plate)
> [style bible] + A tall stack of irregular liquid-chrome and frosted-glass plates balanced on top of each other like architectural strata, each plate a slightly different molten texture, warm vermilion light raking across the stack from the right, composition anchored right side of frame, left third dark/empty for text, tall vertical emphasis within a wide 16:9 canvas.

### fg-stack-plate.webp (foreground cutout)
> [style bible] + A single thin curved chrome plate/blade floating close to camera at a dynamic angle, catching hard gold rim light along its edge, background pure near-black for clean isolation, vertical portrait composition with wide empty margins.

---

## Chapter 03 — RUNTIME (experience timeline)

**Concept**: kinetic motion — molten chrome ribbons in flowing motion-blur, suggesting execution/time in motion.

### bg-runtime-far.webp
> [style bible] + Long soft horizontal streaks of vermilion and gold light trailing across a near-black void like distant motion blur, extremely soft/out of focus, horizontal 21:9, pure atmosphere.

### bg-runtime-mid.webp
> [style bible] + Silhouetted ribbons of molten chrome frozen mid-motion, curving and looping across the frame like a long-exposure light trail made solid, warm rim light along the ribbon edges only, horizontal 21:9, right half kept emptier for text overlay this time.

### bg-runtime-near.webp
> [style bible] + Scattered streaking sparks and molten droplets caught mid-air as if flung from motion, warm highlights, mostly negative space, horizontal 21:9, denser toward the left edge of frame.

### plate-03-runtime.webp (scene plate)
> [style bible] + A dynamic ribbon of liquid chrome captured mid-motion like a long-exposure photograph made solid, twisting and looping through the dark studio space, trailing molten droplets, strong vermilion and gold rim light along the direction of motion, composition anchored left side of frame, right third dark/empty for text, cinematic wide shot with sense of velocity.

### fg-runtime-droplet.webp (foreground cutout)
> [style bible] + A cluster of frozen molten chrome droplets caught mid-splash close to camera, extreme close-up, sharp warm rim highlights, background pure near-black for clean isolation, vertical portrait composition, generous empty margin.

---

## Chapter 04 — MODULES (projects grid)

**Concept**: assembled fragments — modular chrome blocks/monoliths orbiting and slotting together, representing discrete built things.

### bg-modules-far.webp
> [style bible] + Faint scattered geometric glints of light floating in a near-black void like distant orbiting fragments, extremely soft focus, horizontal 21:9, pure atmosphere.

### bg-modules-mid.webp
> [style bible] + Silhouettes of several distinct blocky chrome monoliths of varying size floating at different depths as if orbiting slowly, each catching a sliver of warm rim light on one edge, horizontal 21:9 composition, right side kept emptier for the project grid overlay.

### bg-modules-near.webp
> [style bible] + A few larger out-of-focus geometric chrome fragments drifting close to camera, warm highlights only, mostly negative space, horizontal 21:9, denser toward the bottom-right corner.

### plate-04-modules.webp (scene plate)
> [style bible] + A cluster of four distinct blocky liquid-chrome monoliths of varying proportions, each a different molten texture, floating and slightly rotated as if slotting together like modules, warm vermilion and gold light raking across the cluster, composition anchored right side of frame, left third dark/empty for text, cinematic wide shot.

### fg-modules-block.webp (foreground cutout)
> [style bible] + A single small chrome module/block floating close to camera at a dynamic tilt, catching hard warm rim light along its edges, background pure near-black for clean isolation, vertical portrait composition, generous empty margin.

---

## Chapter 05 — DEPLOY (contact / closing)

**Concept**: ascension — a chrome signal tower / launch form rising and dissolving into light, the crescendo close.

### bg-deploy-far.webp
> [style bible] + A wide soft vertical column of vermilion-to-gold glow rising through a near-black void like a distant beacon, extremely soft focus, horizontal 21:9, pure atmosphere, centered.

### bg-deploy-mid.webp
> [style bible] + Silhouette of a slender chrome tower/spire rising from the bottom of frame into haze, warm rim light along its full height, horizontal 21:9 composition, centered with generous empty space above and to the sides for text.

### bg-deploy-near.webp
> [style bible] + Rising embers, sparks and drifting metallic dust ascending upward through frame, warm highlights, mostly negative space, horizontal 21:9, denser toward the bottom edge.

### plate-05-deploy.webp (scene plate) — REVISED: portal, not spire
> [style bible] + A tall liquid-chrome archway or gate standing alone on the dark studio floor, its inner opening dissolving into a blinding wash of vermilion and gold light so the far side is unreadable, strong rim light tracing the inner curve of the arch, molten drips and fine cracks running down the outer edge of the frame, composition centered with symmetric empty space either side for closing copy, cinematic wide shot, sense of passage and arrival rather than ascension.

### fg-deploy-ember.webp (foreground cutout)
> [style bible] + A small cluster of glowing embers and molten sparks caught mid-rise close to camera, extreme close-up, warm rim highlights fading to dark, background pure near-black for clean isolation, vertical portrait composition, generous empty margin.

---

## Notes for generation

- Keep every background layer (`bg-*`) genuinely sparse — they're meant to sit *behind* DOM copy at low opacity/contrast. If a layer looks busy or "finished" on its own, it's too loud for a background plate.
- Scene plates (`plate-*`) are the one full-detail hero image per chapter — treat these like Kage's 4 generated plates.
- Cutouts (`fg-*`) should render against **near-black**, not transparent — the site composites them with `mix-blend-mode: lighten`, so pure #05070a background drops out automatically once you export as WebP.
- Send them back in the same batch order (far → mid → near → plate → cutout) per chapter and I'll wire the parallax stack + cross-fades into `PlateBackdrop`.
