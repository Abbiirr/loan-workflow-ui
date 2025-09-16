// src/utils/download.ts
export async function downloadAsPng(element: HTMLElement, opts?: { backgroundColor?: string }) {
  // Minimal implementation using html-to-image if available, otherwise noop.
  // The project has html-to-image in package.json; import dynamically to avoid bundling issues here.
  try {
    const htmlToImage = await import('html-to-image');
    // html-to-image has named exports and default in different versions
    const toPng = (htmlToImage as any).toPng ?? (htmlToImage.default as any).toPng;
    if (!toPng) throw new Error('html-to-image.toPng not found');
    const dataUrl = await toPng(element, { backgroundColor: opts?.backgroundColor || undefined });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'workflow.png';
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    // best-effort: log so developers see why export failed
     
    console.warn('Export not available', error);
  }
}
