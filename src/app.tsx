import { createElement, useState, useEffect, renderApp } from './index.js';

function Counter() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Hello");

  useEffect(() => {
    document.title = `Count is ${count}`;
    console.log(`Effect ran! Count: ${count}`);
  }, [count]);

  return (
    <div className="container" style="padding: 20px; font-family: sans-serif;">
      <h1>{text}! Count is: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)} style="margin-left: 10px;">Decrement</button>
      <hr />
      <input
        value={text}
        onInput={(e: any) => setText(e.target.value)}
      />
    </div>
  );
}

// Start the app!
const root = document.getElementById('root');
if (root) {
  renderApp(Counter, root);
}
