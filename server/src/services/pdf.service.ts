/// <reference lib="dom" />
import puppeteer from "puppeteer";
import { ICV } from "../interfaces/cv.interface";
import { ITemplate } from "../interfaces/template.interface";

export class PDFService {
  static async generatePDF(cv: ICV, template: ITemplate): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(template.templateData.html, {
        waitUntil: "networkidle0",
      });

      // Inject CV data into the template
      await page.evaluate(
        (cvData: Record<string, any>) => {
          // Replace placeholders with actual data
          const replacePlaceholders = (element: Element) => {
            const placeholders = element.querySelectorAll("[data-cv-field]");
            placeholders.forEach((placeholder: Element) => {
              const field = placeholder.getAttribute("data-cv-field");
              if (field && cvData[field]) {
                placeholder.textContent = cvData[field];
              }
            });
          };

          replacePlaceholders(document.body);
        },
        {
          ...cv.personalDetails,
          education: cv.education,
          experience: cv.experience,
          skills: cv.skills,
          languages: cv.languages,
          projects: cv.projects,
          certifications: cv.certifications,
        }
      );

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
