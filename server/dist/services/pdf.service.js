"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFService = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class PDFService {
    static async generatePDF(cv, template) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const browser = await puppeteer_1.default.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        try {
            const page = await browser.newPage();
            await page.setViewport({ width: 1200, height: 800 });
            const html = `
        <html>
          <head><title>CV</title></head>
          <body style="font-family: Arial; padding: 20px;">
            <h1>${((_a = cv.personalDetails) === null || _a === void 0 ? void 0 : _a.fullName) || "CV"}</h1>
            <p>${((_b = cv.personalDetails) === null || _b === void 0 ? void 0 : _b.email) || ""}</p>
            <p>${((_c = cv.personalDetails) === null || _c === void 0 ? void 0 : _c.phone) || ""}</p>
            <p>${((_d = cv.personalDetails) === null || _d === void 0 ? void 0 : _d.location) || ""}</p>
            ${((_e = cv.personalDetails) === null || _e === void 0 ? void 0 : _e.summary)
                ? `<p>${cv.personalDetails.summary}</p>`
                : ""}
            ${((_f = cv.experience) === null || _f === void 0 ? void 0 : _f.map((exp) => `<p><strong>${exp.position}</strong> at ${exp.company}</p>`).join("")) || ""}
            ${((_g = cv.education) === null || _g === void 0 ? void 0 : _g.map((edu) => `<p><strong>${edu.degree}</strong> from ${edu.institution}</p>`).join("")) || ""}
            ${((_h = cv.skills) === null || _h === void 0 ? void 0 : _h.map((skill) => `<span>${skill.name || skill}</span>`).join(", ")) || ""}
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
        }
        finally {
            await browser.close();
        }
    }
}
exports.PDFService = PDFService;
//# sourceMappingURL=pdf.service.js.map