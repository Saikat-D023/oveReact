// We are ignoring strict types for speed (using 'any')
export function createElement(type: any, props: any, ...children: any[]) {
  return {
    type,
    props: props || {},
    // Flatten children so we don't end up with nested arrays
    children: children.flat()
  };
}

export function renderNode(vdom: any): any {
  // 1. Handle raw text or numbers
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(String(vdom));
  }

  // 2. Create the physical DOM element
  const domElement = document.createElement(vdom.type);

  // 3. Attach properties (like id, class, onclick)
  for (const [key, value] of Object.entries(vdom.props)) {
    if (key.startsWith('on') && typeof value === 'function') {
      // It's an event listener (e.g., onclick -> click)
      const eventName = key.substring(2).toLowerCase();
      domElement.addEventListener(eventName, value as EventListenerOrEventListenerObject);
    } else {
      domElement.setAttribute(key, value as string);
    }
  }

  // 4. Recursively render and append all children
  vdom.children.forEach((child: any) => {
    domElement.appendChild(renderNode(child));
  });

  return domElement;
}
