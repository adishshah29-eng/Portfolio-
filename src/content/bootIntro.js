// Shared timing for Boot's pinned intro sequence — imported by both
// App.jsx (the plate's zoom scroll-range) and Boot.jsx (the pinned text
// timeline), so the two stay numerically in sync without duplicating the
// numbers in two places.
export const BOOT_PIN_DISTANCE = 1500; // total px of scroll the hero stays pinned for
export const BOOT_ZOOM_DISTANCE = 520; // px of that spent on the plate's approach, before text starts
