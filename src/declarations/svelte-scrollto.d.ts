declare module "svelte-scrollto" {
  export const scrollto: SvelteAction;
  export const scrollTo: (opts: {
    element: string;
    x?: number;
    y?: number;
  }) => void;
  export const setGlobalOptions: (opts: {
    container?: string;
    duration?: number;
    delay?: number;
    offset?: number;
    easing?: (t: number) => number;
    onStart?: () => void;
    onDone?: () => void;
    onAborting?: () => void;
    scrollX?: boolean;
    scrollY?: boolean;
  }) => void;
}
