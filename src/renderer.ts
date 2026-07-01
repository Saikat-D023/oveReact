import { renderNode, updateElement, type VDomElement } from './vdom.js';
import { resetHookIndex } from './hooks.js';

let rootContainer: HTMLElement | null = null;           //where is the app -> root
let rootComponent: (() => VDomElement) | null = null;   //what is the app
let currentVDom: VDomElement | null = null;             //what did the app look like last time

export function renderApp(Component: () => VDomElement, container: HTMLElement) {
  rootContainer = container; //setting it as the root container
  rootComponent = Component; //setting the component as the root component

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
