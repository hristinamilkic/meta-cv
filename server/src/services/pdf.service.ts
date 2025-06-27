/// <reference lib="dom" />
import puppeteer from "puppeteer";
import { ITemplate } from "../interfaces/template.interface";
import Handlebars from "handlebars";

interface CVDataForPDF {
  personalDetails: Record<string, any>;
  education: any[];
  experience: any[];
  skills: any[];
  languages: any[];
  projects: any[];
  certifications: any[];
  title?: string;
}

export class PDFService {
  static async generatePDF(
    cv: CVDataForPDF,
    template: ITemplate
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });

      // Compile template HTML with Handlebars
      const compiled = Handlebars.compile(template.templateData.html);
      const htmlContent = compiled({ ...cv });

      // Combine with template CSS
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
    } finally {
      await browser.close();
    }
  }
}
