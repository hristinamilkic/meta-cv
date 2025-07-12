"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePuppeteerBrowser = closePuppeteerBrowser;
exports.generateTemplateThumbnail = generateTemplateThumbnail;
exports.generateCVThumbnail = generateCVThumbnail;
const puppeteer_1 = __importDefault(require("puppeteer"));
const handlebars_1 = __importDefault(require("handlebars"));
let browser = null;
async function getBrowser() {
    if (!browser) {
        browser = await puppeteer_1.default.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
    }
    return browser;
}
async function closePuppeteerBrowser() {
    if (browser) {
        await browser.close();
        browser = null;
    }
}
async function generateTemplateThumbnail(html, css, width = 800, height = 1131) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
        await page.setViewport({ width, height });
        await page.setContent(`
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
      </html>
    `, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(100);
        const element = await page.$("body");
        if (!element)
            throw new Error("Body element not found");
        const screenshot = await element.screenshot({ encoding: "base64" });
        return `data:image/png;base64,${screenshot}`;
    }
    finally {
        await page.close();
    }
}
async function generateCVThumbnail(cv, template, width = 800, height = 1131) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
        await page.setViewport({ width, height });
        const compiled = handlebars_1.default.compile(template.templateData.html);
        const htmlContent = compiled({ ...cv });
        const css = `<style>${template.templateData.css}</style>`;
        const html = `<html><head>${css}</head><body>${htmlContent}</body></html>`;
        await page.setContent(html, { waitUntil: "networkidle0" });
        await page.waitForTimeout(100);
        const element = await page.$("body");
        if (!element)
            throw new Error("Body element not found");
        const screenshot = await element.screenshot({ encoding: "base64" });
        return `data:image/png;base64,${screenshot}`;
    }
    finally {
        await page.close();
    }
}
//# sourceMappingURL=template-thumbnail.service.js.map