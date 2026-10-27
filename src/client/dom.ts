/** document.querySelector that throws a clear error instead of returning null. */
export function qs<T extends Element = HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) {
    throw new Error(`Element not found: ${selector}`);
  }
  return el;
}
