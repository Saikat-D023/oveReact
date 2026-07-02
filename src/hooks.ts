import { triggerRerender } from './renderer.ts';

// Global memory for our hooks
let hooks: any[] = [];
let hookIndex = 0;

export function resetHookIndex() {
  hookIndex = 0;
}

export function useState(initialValue: number | string | boolean) {
  // Capture the current index for this specific hook call
  const currentIndex = hookIndex;

  // If this is the first time, initialize it
  if (hooks[currentIndex] === undefined) {
    hooks[currentIndex] = initialValue;
  }

  // The setter function
  const setState = (newValue: number | string | boolean) => {
    hooks[currentIndex] = newValue;
    // Force the whole app to redraw!
    triggerRerender();
  };

  // Move the pointer for the next useState call
  hookIndex++;

  return [hooks[currentIndex], setState];
}

export function useEffect(effect: () => void, deps?: (number | string | boolean)[]) {
  const oldDeps = hooks[hookIndex];
  let hasChanged = false;

  if (!deps) {
    // Case 1: No dependency array provided at all (e.g. useEffect(() => {...}))
    // It should run on every single render.
    hasChanged = true;
  } else if (!oldDeps) {
    // Case 2: This is the very first render.
    // oldDeps doesn't exist yet, so we definitely need to run the effect.
    hasChanged = true;
  } else {
    // Case 3: Compare the new dependencies against the old dependencies one by one.
    for (let i = 0; i < deps.length; i++) {
      if (deps[i] !== oldDeps[i]) {
        hasChanged = true;
        break; // Stop checking as soon as we find one difference
      }
    }
  }

  // If anything changed (or if it's the first render), run the effect!
  if (hasChanged) {
    hooks[hookIndex] = deps; // Save the new deps for next time
    setTimeout(effect, 0);   // Schedule the effect to run
  }

  // Move the pointer for the next hook
  hookIndex++;
}

export function useRef<T>(initialValue: T) {
  const currentIndex = hookIndex;

  // If this is the first time, initialize it as an object with a 'current' object
  if (hooks[currentIndex] === undefined) {
    hooks[currentIndex] = { current: initialValue };
  }

  // Move the pointer for the next hook
  hookIndex++;

  return hooks[currentIndex];
}