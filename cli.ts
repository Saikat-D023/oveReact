#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

console.log('Setting up your oveReact project...');

const projectName = process.argv[2];
if (!projectName) {
  console.error('Please specify the project directory:');
  console.log('  npx overeact <project-directory>');
  process.exit(1);
}

const projectPath = path.resolve(process.cwd(), projectName);
if (fs.existsSync(projectPath)) {
  console.error(`Directory "${projectName}" already exists!`);
  process.exit(1);
}

fs.mkdirSync(projectPath, { recursive: true });

// Basic package.json template
const pkg = {
  name: projectName,
  version: "1.0.0",
  type: "module",
  scripts: {
    "dev": "bun build src/app.tsx --outfile dist/bundle.js --watch & bunx serve"
  },
  dependencies: {
    "overeact": "latest"
  },
  devDependencies: {
    "typescript": "^5"
  }
};

fs.writeFileSync(
  path.join(projectPath, 'package.json'),
  JSON.stringify(pkg, null, 2)
);

fs.mkdirSync(path.join(projectPath, 'src'));

// Basic index.html template
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>oveReact App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./dist/bundle.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(projectPath, 'index.html'), html);

// Basic app.tsx template
const appTsx = `import { createElement, useState, renderApp } from 'overeact';

function App() {
  const [count, setCount] = useState(0);
  return (
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>Welcome to oveReact!</h1>
      <button onClick={() => setCount(count + 1)}>
        Count is: {count}
      </button>
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  renderApp(App, root);
}
`;

fs.writeFileSync(path.join(projectPath, 'src', 'app.tsx'), appTsx);

console.log(`\nSuccess! Created ${projectName} at ${projectPath}`);
console.log('\nInside that directory, you can run several commands:');
console.log('  bun install');
console.log('  bun run dev');
