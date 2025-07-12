"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetaCVLogoBase64 = getMetaCVLogoBase64;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getMetaCVLogoBase64() {
    try {
        const logoPath = path_1.default.join(__dirname, "../../../client/public/logo-metacv.png");
        if (!fs_1.default.existsSync(logoPath)) {
            console.warn("Logo file not found at:", logoPath);
            return getFallbackLogo();
        }
        const logoBuffer = fs_1.default.readFileSync(logoPath);
        const base64Logo = logoBuffer.toString("base64");
        return `data:image/png;base64,${base64Logo}`;
    }
    catch (error) {
        console.warn("Error loading logo file:", error);
        return getFallbackLogo();
    }
}
function getFallbackLogo() {
    const fallbackSVG = `
    <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2C003E;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#512B58;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="200" height="60" fill="url(#logoGradient)" rx="8"/>
      <text x="100" y="35" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">MetaCV</text>
      <text x="100" y="50" font-family="Arial, sans-serif" font-size="10" fill="#f2e9e4" text-anchor="middle">Professional CV Builder</text>
    </svg>
  `;
    const fallbackBase64 = Buffer.from(fallbackSVG).toString("base64");
    return `data:image/svg+xml;base64,${fallbackBase64}`;
}
//# sourceMappingURL=logo.util.js.map