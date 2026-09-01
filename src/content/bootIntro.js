// Shared timing for Boot's pinned intro sequence — imported by App.jsx (the
// plate's background-layer scroll range) and Boot.jsx (the pinned text
// timeline), so the two stay numerically in sync without duplicating the
// numbers in two places. #boot's min-height in styles.css must equal
// 100vh + BOOT_PIN_DISTANCE + BOOT_BREATHING_SPACE — kept manually in sync
// there since CSS can't import these.
export const BOOT_PIN_DISTANCE = 1000; // px of scroll the text-reveal scrub runs across
export const BOOT_BREATHING_SPACE = 500; // extra px the hero stays pinned, fully revealed and idle, before Stack begins
