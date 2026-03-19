// Disable keyboard shortcuts for developer tools only
function disableShortcuts(e) {
  // Only block specific developer tool shortcuts
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
    (e.ctrlKey && e.key === 'U')
  ) {
    e.preventDefault();
    return false;
  }
  // Allow other keyboard shortcuts for normal navigation
  return true;
}

// Add event listener for keyboard shortcuts only
document.addEventListener('keydown', function(e) {
  return disableShortcuts(e);
});
