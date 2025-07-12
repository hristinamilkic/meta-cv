"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFService = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const handlebars_1 = __importDefault(require("handlebars"));
class PDFService {
    static async generatePDF(cv, template) {
        const browser = await puppeteer_1.default.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        try {
            const page = await browser.newPage();
            await page.setViewport({ width: 1200, height: 800 });
            const compiled = handlebars_1.default.compile(template.templateData.html);
            const htmlContent = compiled({ ...cv });
            const css = `<style>${template.templateData.css}</style>`;
            const html = `<html><head>${css}</head><body>${htmlContent}</body></html>`;
            await page.setContent(html, { waitUntil: "networkidle0" });
            await page.waitForTimeout(1000);
            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true,
                margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
            });
            return Buffer.from(pdfBuffer);
        }
        finally {
            await browser.close();
        }
    }
}
exports.PDFService = PDFService;
//# sourceMappingURL=pdf.service.js.map