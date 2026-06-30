// 1. define the structure of virtual dom
export interface VDomNode {
  type: string,
  props: Record<string, any>,
  children: (VDomNode | string | number)[]
}

// 2. create a virtual dom element
export function createElement(type: string, props: Record<string, any> = {}, ...children: any[]): VDomNode {
  return {
    type,
    props: props || {},
    // Flatten children so we don't end up with nested arrays
    children: children.flat()
  };
}

// Helper for events
const isEvent = (key: string) => key.startsWith("on");
const getEventName = (key: string) => key.substring(2).toLowerCase();

// 3. render a vdom object into a real dom node (formerly createDom)
export function renderNode(vdom: any): Node {
  // Handle raw text or numbers
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(String(vdom));
  }

  // Create the physical DOM element
  const domElement = document.createElement(vdom.type);

  // Attach properties (like id, className, onClick)
  if (vdom.props) {
    for (const [key, value] of Object.entries(vdom.props)) {
      if (isEvent(key) && typeof value === "function") {
        domElement.addEventListener(getEventName(key), value as EventListener);
      } else {
        const attributeName = key === "className" ? "class" : key;
        domElement.setAttribute(attributeName, String(value));
      }
    }
  }

  // Recursively render and append all children
  if (vdom.children) {
    vdom.children.forEach((child: any) => {
      domElement.appendChild(renderNode(child));
    });
  }

  return domElement;
}

// 4. Update properties on a DOM element
export function updateProps(dom: HTMLElement, newProps: Record<string, any> = {}, oldProps: Record<string, any> = {}) {
  // Remove old properties
  for (const key of Object.keys(oldProps)) {
    if (!(key in newProps)) {
      if (isEvent(key)) {
        // Removing event listeners requires the original function reference, which can be tricky.
        // For a simple implementation, we might skip full event removal, or just nullify if it was an attribute.
        // A true React clone would use an event delegation system. 
        dom.removeEventListener(getEventName(key), oldProps[key]);
      } else {
        const attributeName = key === "className" ? "class" : key;
        dom.removeAttribute(attributeName);
      }
    }
  }

  // Set new or changed properties
  for (const key of Object.keys(newProps)) {
    const newValue = newProps[key];
    const oldValue = oldProps[key];
    
    if (newValue !== oldValue) {
      if (isEvent(key)) {
        // If it's a new event or changed event, add the new one. 
        // Note: Ideally we'd remove the old one first if it existed.
        if (oldValue) {
          dom.removeEventListener(getEventName(key), oldValue);
        }
        dom.addEventListener(getEventName(key), newValue as EventListener);
      } else {
        const attributeName = key === "className" ? "class" : key;
        dom.setAttribute(attributeName, String(newValue));
      }
    }
  }
}

// 5. Diffing and updating the DOM
export function updateElement(parent: Node, newNode: any, oldNode: any, index: number = 0) {
  if (!oldNode) {
    // Node was added
    parent.appendChild(renderNode(newNode));
  } else if (!newNode) {
    // Node was removed
    if (parent.childNodes[index]) {
      parent.removeChild(parent.childNodes[index]);
    }
  } else if (typeof newNode === 'string' || typeof newNode === 'number' || typeof oldNode === 'string' || typeof oldNode === 'number') {
    // Text nodes
    if (newNode !== oldNode) {
      parent.replaceChild(renderNode(newNode), parent.childNodes[index]);
    }
  } else if (newNode.type !== oldNode.type) {
    // Node type changed entirely (e.g., div -> span)
    parent.replaceChild(renderNode(newNode), parent.childNodes[index]);
  } else {
    // Node is the same type, update props and diff children
    const domElement = parent.childNodes[index] as HTMLElement;
    updateProps(domElement, newNode.props, oldNode.props);
    
    const newLength = newNode.children ? newNode.children.length : 0;
    const oldLength = oldNode.children ? oldNode.children.length : 0;
    
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(domElement, newNode.children[i], oldNode.children[i], i);
    }
  }
}