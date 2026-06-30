import { renderNode, updateElement } from './vdom.js';
import { resetHookIndex } from './hooks.js';

let rootContainer: HTMLElement | null = null;
let rootComponent: any = null;
let currentVDom: any = null;

export function renderApp(Component: any, container: HTMLElement) {
  rootContainer = container;
  rootComponent = Component;
  
  // Reset our hooks
  resetHookIndex();
  
  // Run the component function to get the Virtual DOM
  const newVDom = Component();
  
  if (currentVDom) {
    // Subsequent renders: Diff the VDOM
    updateElement(container, newVDom, currentVDom, 0);
  } else {
    // First render: wipe and attach
    container.innerHTML = '';
    container.appendChild(renderNode(newVDom));
  }
  
  currentVDom = newVDom;
}

// A helper to trigger a full re-render
export function triggerRerender() {
  if (rootContainer && rootComponent) {
    renderApp(rootComponent, rootContainer);
  }
}
