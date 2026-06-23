import { renderNode } from './vdom.js';
import { resetHookIndex } from './hooks.js';

let rootContainer: HTMLElement | null = null;
let rootComponent: any = null;

export function renderApp(Component: any, container: HTMLElement) {
  rootContainer = container;
  rootComponent = Component;
  
  // Wipe the existing DOM
  container.innerHTML = '';
  
  // Reset our hooks
  resetHookIndex();
  
  // Run the component function to get the Virtual DOM
  const vdom = Component();
  
  // Convert VDOM to real DOM and attach it
  container.appendChild(renderNode(vdom));
}

// A helper to trigger a full re-render
export function triggerRerender() {
  if (rootContainer && rootComponent) {
    renderApp(rootComponent, rootContainer);
  }
}
