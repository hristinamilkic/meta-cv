import puppeteer, { Browser } from "puppeteer";
import Handlebars from "handlebars";

let browser: Browser | null = null;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browser;
}

export async function closePuppeteerBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

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
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width, height });
    await page.setContent(
      `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
      </html>
    `,
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForTimeout(100);
    const element = await page.$("body");
    if (!element) throw new Error("Body element not found");
    const screenshot = await element.screenshot({ encoding: "base64" });
    return `data:image/png;base64,${screenshot}`;
  } finally {
    await page.close();
  }
}

/**
 * Generates a PNG thumbnail for a CV using its template and data.
 * @param cv The CV data object.
 * @param template The template object (with templateData.html and templateData.css).
 * @param width The width of the thumbnail (default 800).
 * @param height The height of the thumbnail (default 1131, ~A4 ratio).
 * @returns A base64-encoded PNG image string.
 */
export async function generateCVThumbnail(
  cv: any,
  template: { templateData: { html: string; css: string } },
  width = 800,
  height = 1131
): Promise<string> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width, height });
    // Compile template HTML with Handlebars
    const compiled = Handlebars.compile(template.templateData.html);
    const htmlContent = compiled({ ...cv });
    const css = `<style>${template.templateData.css}</style>`;
    const html = `<html><head>${css}</head><body>${htmlContent}</body></html>`;
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.waitForTimeout(100);
    const element = await page.$("body");
    if (!element) throw new Error("Body element not found");
    const screenshot = await element.screenshot({ encoding: "base64" });
    return `data:image/png;base64,${screenshot}`;
  } finally {
    await page.close();
  }
}
