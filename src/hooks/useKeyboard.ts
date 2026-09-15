import { useEffect, useRef } from 'react';

/**
 * Keyboard shortcut hook that maps key names to callback functions.
 *
 * Listens for `keydown` events on the document and invokes the matching
 * callback when a registered key is pressed.
 *
 * Ignores events when the user is typing in an input, textarea, or
 * contentEditable element to avoid interfering with form interactions.
 *
 * @param shortcuts - A record mapping key names (e.g. 'Escape', 'ArrowRight', 'a')
 *                    to callback functions.
 *
 * @example
 * ```tsx
 * useKeyboard({
 *   Escape: () => closeModal(),
 *   ArrowRight: () => nextSlide(),
 *   ArrowLeft: () => prevSlide(),
 * });
 * ```
 */
export function useKeyboard(shortcuts: Record<string, () => void>): void {
  const shortcutsRef = useRef(shortcuts);

  // Keep shortcuts ref up to date
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Don't intercept when user is typing in form elements
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      if (
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select' ||
        target.isContentEditable
      ) {
        return;
      }

      const callback = shortcutsRef.current[event.key];
      if (callback) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
}
