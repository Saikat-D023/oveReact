import { createElement, useState, renderApp } from './index.js';

function Counter() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Hello");

  return (
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>{text}! Count is: {count}</h1>
      <button onclick={() => setCount(count + 1)}>Increment</button>
      <button onclick={() => setCount(count - 1)} style="margin-left: 10px;">Decrement</button>
      <hr />
      <input 
        value={text} 
        oninput={(e: any) => setText(e.target.value)} 
      />
    </div>
  );
}

// Start the app!
const root = document.getElementById('root');
if (root) {
  renderApp(Counter, root);
}
