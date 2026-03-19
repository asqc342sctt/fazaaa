const fs = require('fs');
const path = require('path');

function processHTMLFiles(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other non-essential directories
      if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
        processHTMLFiles(fullPath);
      }
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Remove protection script reference
      if (content.includes('protect.js')) {
        content = content.replace(/    <script src="js\/protect\.js"><\/script>\n  <\/body>/g, '</body>');
        content = content.replace(/<script src="js\/protect\.js"><\/script>/g, '');
        modified = true;
      }
      
      // Remove event handlers from body tag
      if (content.includes('oncontextmenu=')) {
        content = content.replace(/<body[^>]*oncontextmenu="return false;"[^>]*onkeydown="return disableShortcuts\(event\)"[^>]*onmousedown="return disableInspect\(event\)"[^>]*>/g, '<body>');
        content = content.replace(/<body[^>]*oncontextmenu="return false;"[^>]*>/g, '<body>');
        content = content.replace(/oncontextmenu="return false;"/g, '');
        content = content.replace(/onkeydown="return disableShortcuts\(event\)"/g, '');
        content = content.replace(/onmousedown="return disableInspect\(event\)"/g, '');
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Removed protection from: ${fullPath}`);
      }
    }
  });
}

// Start processing from the current directory
processHTMLFiles(__dirname);
console.log('Protection has been removed from all HTML files.');
