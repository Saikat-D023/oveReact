import { createElement, useState, renderApp } from './index.js';

function Counter() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Hello");

  // It looks messy without JSX, but this is exactly what JSX compiles to!
  return createElement('div', { style: 'padding: 20px; font-family: sans-serif;' },
    createElement('h1', {}, `${text}! Count is: ${count}`),
    createElement('button', { 
      onclick: () => setCount(count + 1) 
    }, 'Increment'),
    createElement('button', { 
      onclick: () => setCount(count - 1), style: 'margin-left: 10px;' 
    }, 'Decrement'),
    createElement('hr', {}),
    createElement('input', {
      value: text,
      oninput: (e: any) => setText(e.target.value)
    })
  );
}

// Start the app!
const root = document.getElementById('root');
if (root) {
  renderApp(Counter, root);
}
