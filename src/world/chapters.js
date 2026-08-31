// Camera + world-state ledger for "The Interface" — a living UI the camera
// travels through. Journey shape: wide establishing view over the layout
// grid -> descend among floating cards -> glide along a guide line ->
// arrive at the four project windows -> rise toward the focus ring.
export const CHAPTERS = [
  {
    id: 'boot',
    camera: {
      p: [0, 5.2, 16], t: [0, 3.0, -20], fov: 36,
      mobile: { p: [0, 6.4, 22], t: [0, 4.0, -20], fov: 46 }
    },
    world: { fog: 0.026, key: 0.32, signal: 0.55, grade: '#8fa4c9' }
  },
  {
    id: 'stack',
    camera: {
      p: [-6.0, 2.4, 6.0], t: [1.5, 3.2, -12], fov: 42,
      mobile: { p: [-5.0, 3.4, 10], t: [1.0, 3.6, -12], fov: 50 }
    },
    world: { fog: 0.032, key: 0.26, signal: 0.4, grade: '#8b96a0' }
  },
  {
    id: 'runtime',
    camera: {
      p: [4.0, 1.6, -8], t: [-2.0, 2.0, -34], fov: 40,
      mobile: { p: [3.0, 2.6, -6], t: [-1.0, 2.6, -34], fov: 48 }
    },
    world: { fog: 0.036, key: 0.24, signal: 0.35, grade: '#9a8b7c' }
  },
  {
    id: 'modules',
    camera: {
      p: [-3.0, 3.0, -26], t: [3.0, 2.6, -38], fov: 38,
      mobile: { p: [-2.0, 3.8, -24], t: [2.5, 3.2, -38], fov: 46 }
    },
    world: { fog: 0.030, key: 0.28, signal: 0.55, grade: '#b98a5c' }
  },
  {
    id: 'deploy',
    camera: {
      p: [0, 10.0, -30], t: [0, 16.0, -66], fov: 40,
      mobile: { p: [0, 11.5, -26], t: [0, 17, -66], fov: 48 }
    },
    world: { fog: 0.022, key: 0.36, signal: 1.0, grade: '#e0a15c' }
  }
];

export const CHAPTER_IDS = CHAPTERS.map((c) => c.id);
