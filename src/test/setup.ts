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
