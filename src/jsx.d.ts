// We use 'any' to allow dynamic attributes (like onclick, id, style)
// that we handle manually in the renderer.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
