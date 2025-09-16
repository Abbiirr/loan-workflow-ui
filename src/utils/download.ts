// src/utils/download.ts
type ToPngFn = (node: HTMLElement, options?: { backgroundColor?: string }) => Promise<string>;

type HtmlToImageModule = {
  toPng?: ToPngFn;
  default?: {
    toPng?: ToPngFn;
  };
};

export async function downloadAsPng(element: HTMLElement, opts?: { backgroundColor?: string }) {
  // Minimal implementation using html-to-image if available, otherwise noop.
  // The project has html-to-image in package.json; import dynamically to avoid bundling issues here.
  try {
    const mod = (await import("html-to-image")) as unknown as HtmlToImageModule;
    // html-to-image has named exports and default in different versions
  const toPng: ToPngFn | undefined = mod.toPng ?? mod.default?.toPng;
    if (!toPng) throw new Error("html-to-image.toPng not found");
    const dataUrl = await toPng(element, { backgroundColor: opts?.backgroundColor || undefined });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "workflow.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    // best-effort: log so developers see why export failed
    console.warn("Export not available", error);
  }
}
