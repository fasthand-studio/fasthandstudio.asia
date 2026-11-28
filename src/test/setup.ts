import "@testing-library/jest-dom/vitest";

// lottie-web probes a 2d canvas context at import time; jsdom's canvas is null without the
// native canvas package, which would crash every route that renders an IconTree icon.
const noopContext = new Proxy(
  {},
  {
    get: (target, prop) =>
      prop === "canvas" ? document.createElement("canvas") : () => noopContext,
    set: () => true,
  },
);
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: () => noopContext,
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

// jsdom 20 ships no localStorage; the toggle must never store anything, so an
// instrumented in-memory stub is enough to prove it does not.
const fakeStorage = () => {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
    key: (i: number) => [...map.keys()][i] ?? null,
    get length() {
      return map.size;
    },
  };
};
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: fakeStorage() });

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
