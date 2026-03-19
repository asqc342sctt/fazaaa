const fs = require('fs').promises;
const path = require('path');

const ROOT = process.cwd();
const INJECTION = '<script src="ads-fazza.js"></script>';
let modified = [];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      await walk(full);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      await processFile(full);
    }
  }
}

async function processFile(filePath) {
  try {
    let txt = await fs.readFile(filePath, 'utf8');
    if (txt.includes('ads-fazza.js')) return; // already includes

    const bodyCloseRegex = /<\/body>/i;
    if (bodyCloseRegex.test(txt)) {
      txt = txt.replace(bodyCloseRegex, INJECTION + '\n</body>');
    } else {
      // append at end if no </body>
      txt = txt + '\n' + INJECTION + '\n';
    }

    await fs.writeFile(filePath, txt, 'utf8');
    modified.push(path.relative(ROOT, filePath));
  } catch (err) {
    console.error('Error processing', filePath, err.message);
  }
}

(async function() {
  try {
    await walk(ROOT);
    console.log('\nModified files:', modified.length);
    modified.forEach(f => console.log('- ' + f));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
