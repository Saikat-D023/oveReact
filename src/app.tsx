import { createElement, useState, useEffect, useRef, renderApp } from './index.js';

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  // Example of useEffect: Updates the document title when 'count' changes
  useEffect(() => {
    document.title = `Count is ${count}`;
    console.log(`Effect ran! Count updated to: ${count}`);
  }, [count]);

  // Example of useRef: Imperatively focus the input element
  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="container" style="padding: 20px; font-family: sans-serif; max-width: 400px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">oveReact Demo</h1>
      
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 8px; background: #f9f9f9;">
        <h3>Counter: {count}</h3>
        <button onClick={() => (setCount as any)(count + 1)} style="padding: 8px 16px; cursor: pointer; border-radius: 4px; border: 1px solid #aaa;">Increment</button>
        <button onClick={() => (setCount as any)(count - 1)} style="padding: 8px 16px; margin-left: 10px; cursor: pointer; border-radius: 4px; border: 1px solid #aaa;">Decrement</button>
      </div>

      <div style="padding: 15px; border: 1px solid #ccc; border-radius: 8px; background: #f9f9f9;">
        <h3>Text Input & useRef Demo</h3>
        <p>You typed: <strong>{text ? text : "(nothing yet)"}</strong></p>
        
        <input
          ref={inputRef}
          value={text}
          onInput={(e: any) => (setText as any)(e.target.value)}
          placeholder="Type something..."
          style="padding: 8px; width: 100%; box-sizing: border-box; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;"
        />
        
        <button onClick={handleFocus} style="padding: 8px 16px; cursor: pointer; width: 100%; border-radius: 4px; border: 1px solid #aaa; background: #e0e0e0;">
          Focus Input using useRef
        </button>
      </div>
    </div>
  );
}

// Start the app!
const root = document.getElementById('root');
if (root) {
  renderApp(App, root);
}
