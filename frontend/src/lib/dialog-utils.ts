// Utility to force clear any stuck dialogs/overlays
export function clearStuckOverlays() {
  // Remove any stuck overlays
  const overlays = document.querySelectorAll('[data-radix-portal]');
  overlays.forEach(overlay => {
    const parent = overlay.parentElement;
    if (parent && parent.style.pointerEvents === 'none') {
      parent.remove();
    }
  });

  // Reset body scroll
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  // Force focus back to body
  if (document.activeElement && document.activeElement !== document.body) {
    (document.activeElement as HTMLElement).blur();
  }
}

// Auto cleanup on route changes
if (typeof window !== 'undefined') {
  let lastPath = window.location.pathname;
  
  const checkPath = () => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      // Small delay to ensure navigation is complete
      setTimeout(clearStuckOverlays, 100);
    }
  };

  // Check for navigation changes
  const observer = new MutationObserver(checkPath);
  observer.observe(document.body, { childList: true, subtree: true });
}
