import puppeteer from "puppeteer";

/**
 * Generates a PNG thumbnail from HTML and CSS using Puppeteer.
 * @param html The HTML string to render.
 * @param css The CSS string to apply.
 * @param width The width of the thumbnail (default 800).
 * @param height The height of the thumbnail (default 1131, ~A4 ratio).
 * @returns A base64-encoded PNG image string.
 */
export async function generateTemplateThumbnail(
  html: string,
  css: string,
  width = 800,
  height = 1131
): Promise<string> {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.setContent(`
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
      </html>
    `);
    await page.waitForTimeout(500);
    const element = await page.$("body");
    if (!element) throw new Error("Body element not found");
    const screenshot = await element.screenshot({ encoding: "base64" });
    return `data:image/png;base64,${screenshot}`;
  } finally {
    await browser.close();
  }
}
