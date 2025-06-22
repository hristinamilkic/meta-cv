/// <reference lib="dom" />
import puppeteer from "puppeteer";
import { ITemplate } from "../interfaces/template.interface";

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

      const html = `
        <html>
          <head><title>CV</title></head>
          <body style="font-family: 'Montserrat', Arial, sans-serif; padding: 20px;">
            <h1>${cv.personalDetails?.fullName || "CV"}</h1>
            <p>${cv.personalDetails?.email || ""}</p>
            <p>${cv.personalDetails?.phone || ""}</p>
            <p>${cv.personalDetails?.location || ""}</p>
            ${
              cv.personalDetails?.summary
                ? `<p>${cv.personalDetails.summary}</p>`
                : ""
            }
            ${
              cv.experience
                ?.map(
                  (exp) =>
                    `<p><strong>${exp.position}</strong> at ${exp.company}</p>`
                )
                .join("") || ""
            }
            ${
              cv.education
                ?.map(
                  (edu) =>
                    `<p><strong>${edu.degree}</strong> from ${edu.institution}</p>`
                )
                .join("") || ""
            }
            ${
              cv.skills
                ?.map((skill) => `<span>${skill.name || skill}</span>`)
                .join(", ") || ""
            }
          </body>
        </html>
      `;

      await page.setContent(html);
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
