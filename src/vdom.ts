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

  const isEvent = (key: string) => key.startsWith("on");
  const getEventName = (key: string) => key.substring(2).toLowerCase();

  // 3. Attach properties (like id, className, onClick)
  for (const [key, value] of Object.entries(vdom.props)) {
    if (isEvent(key) && typeof value === "function") {
      domElement.addEventListener(getEventName(key), value as EventListener);
    } else {
      // Map React's 'className' back to HTML 'class'
      const attributeName = key === "className" ? "class" : key;
      domElement.setAttribute(attributeName, String(value));
    }
  }

  // 4. Recursively render and append all children
  vdom.children.forEach((child: any) => {
    domElement.appendChild(renderNode(child));
  });

  return domElement;
}
