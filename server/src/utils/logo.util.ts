import fs from "fs";
import path from "path";

/**
 * Loads the MetaCV logo PNG file and converts it to base64 for email templates
 * @returns Base64 encoded logo string
 */
export function getMetaCVLogoBase64(): string {
  try {
    // Path to the logo file (relative to the server root)
    const logoPath = path.join(
      __dirname,
      "../../../client/public/logo-metacv.png"
    );

    // Check if file exists
    if (!fs.existsSync(logoPath)) {
      console.warn("Logo file not found at:", logoPath);
      return getFallbackLogo();
    }

    // Read the logo file
    const logoBuffer = fs.readFileSync(logoPath);

    // Convert to base64
    const base64Logo = logoBuffer.toString("base64");

    // Return as data URL
    return `data:image/png;base64,${base64Logo}`;
  } catch (error) {
    console.warn("Error loading logo file:", error);
    return getFallbackLogo();
  }
}

/**
 * Returns a fallback logo as base64 SVG if the PNG file cannot be loaded
 * @returns Base64 encoded fallback logo string
 */
function getFallbackLogo(): string {
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
