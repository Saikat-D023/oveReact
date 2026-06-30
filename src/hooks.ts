import { triggerRerender } from './renderer.ts';

// Global memory for our hooks
let hooks: any[] = [];
let hookIndex = 0;

export function resetHookIndex() {
  hookIndex = 0;
}

export function useState(initialValue: any) {
  // Capture the current index for this specific hook call
  const currentIndex = hookIndex;

  // If this is the first time, initialize it
  if (hooks[currentIndex] === undefined) {
    hooks[currentIndex] = initialValue;
  }

  // The setter function
  const setState = (newValue: any) => {
    hooks[currentIndex] = newValue;
    // THE MAGIC: Force the whole app to redraw!
    triggerRerender();
  };

  // Move the pointer for the next useState call
  hookIndex++;

  return [hooks[currentIndex], setState];
}

export function useEffect(effect: () => void, deps?: any[]) {
  const hasNoDeps = !deps;
  const oldDeps = hooks[hookIndex];
  const depsChanged = oldDeps
    ? !deps!.every((dep, i) => dep === oldDeps[i])
    : true;

  if (hasNoDeps || depsChanged) {
    hooks[hookIndex] = deps;
    // Run the effect after the current render cycle
    setTimeout(effect, 0);
  }
  
  hookIndex++;
}
