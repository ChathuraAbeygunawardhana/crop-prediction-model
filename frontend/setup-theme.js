const fs = require('fs');

const files = [
  'src/app/page.tsx',
  'src/components/CustomDropdown.tsx',
  'src/components/InfoTooltip.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/lime/g, 'neon');
  
  // Bump the contrast for text colors in light mode
  content = content.replace(/(?<!dark:)text-neon-500/g, 'text-neon-700');
  content = content.replace(/(?<!dark:)text-neon-600/g, 'text-neon-800');
  content = content.replace(/(?<!dark:)text-neon-700/g, 'text-neon-800');
  content = content.replace(/(?<!dark:)text-neon-800/g, 'text-neon-900');
  content = content.replace(/(?<!dark:)text-neon-900/g, 'text-neon-950');

  // Bump border contrast similarly
  content = content.replace(/(?<!dark:)border-neon-200/g, 'border-neon-400');
  
  fs.writeFileSync(file, content);
}
