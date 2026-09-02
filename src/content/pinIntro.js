// Pin distances for Stack/Runtime/Modules/Deploy's pinned-intro sequences -
// the same treatment Boot uses (see bootIntro.js), generalized by
// usePinnedReveal.js. Imported by App.jsx (each plate's background-layer
// scroll range) and by each chapter component (the pinned reveal timeline).
// Each #<chapter> min-height in styles.css must equal
// 100vh + <CHAPTER>_PIN_DISTANCE + BREATHING_SPACE - kept manually in sync
// there since CSS can't import these. Distances scale a little with how
// much repeating content each chapter reveals (Stack's 5-row skill legend
// gets more room than Deploy's 3 contact rows) so no chapter's stagger
// feels rushed or drags.
export const BREATHING_SPACE = 500;
export const STACK_PIN_DISTANCE = 1300;
export const RUNTIME_PIN_DISTANCE = 1100;
export const MODULES_PIN_DISTANCE = 1200;
export const DEPLOY_PIN_DISTANCE = 1000;
