// The published page-flip package ships TypeScript source but no declarations.
// This is the public subset used by our React adapter (StPageFlip 2.0.7).
declare module "page-flip" {
  type Orientation = "portrait" | "landscape";
  type FlipState = "read" | "fold_corner" | "user_fold" | "flipping";

  interface FlipSettings {
    width: number;
    height: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    size: "fixed" | "stretch";
    startPage: number;
    drawShadow: boolean;
    flippingTime: number;
    usePortrait: boolean;
    startZIndex: number;
    autoSize: boolean;
    maxShadowOpacity: number;
    showCover: boolean;
    mobileScrollSupport: boolean;
    clickEventForward: boolean;
    useMouseEvents: boolean;
    swipeDistance: number;
    showPageCorners: boolean;
    disableFlipByClick: boolean;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: Partial<FlipSettings>);
    loadFromHTML(items: HTMLElement[]): void;
    updateFromHtml(items: HTMLElement[]): void;
    update(): void;
    destroy(): void;
    flip(page: number, corner?: "top" | "bottom"): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    getPage(index: number): { setDensity(density: "soft" | "hard"): void };
    getOrientation(): Orientation;
    getState(): FlipState;
    getSettings(): FlipSettings;
    on(event: "flip", callback: (event: { data: number }) => void): this;
    on(event: "changeState", callback: (event: { data: FlipState }) => void): this;
    on(event: "changeOrientation", callback: (event: { data: Orientation }) => void): this;
    on(event: "init", callback: (event: { data: { page: number; mode: Orientation } }) => void): this;
    off(event: string): void;
  }
}
