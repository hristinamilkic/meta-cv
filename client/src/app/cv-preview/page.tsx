"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/services/api";

function stylesToCssVars(styles: any) {
  const cssVars = [];

  // Convert camelCase to kebab-case and create CSS variables
  if (styles.primaryColor)
    cssVars.push(`--primary-color: ${styles.primaryColor};`);
  if (styles.secondaryColor)
    cssVars.push(`--secondary-color: ${styles.secondaryColor};`);
  if (styles.backgroundColor)
    cssVars.push(`--background-color: ${styles.backgroundColor};`);
  if (styles.fontFamily) cssVars.push(`--font-family: ${styles.fontFamily};`);
  if (styles.fontSize) cssVars.push(`--font-size: ${styles.fontSize};`);
  if (styles.spacing) cssVars.push(`--spacing: ${styles.spacing};`);
  if (styles.borderRadius)
    cssVars.push(`--border-radius: ${styles.borderRadius};`);
  if (styles.boxShadow) cssVars.push(`--box-shadow: ${styles.boxShadow};`);

  // Add custom styles if they exist
  if (styles.customStyles) {
    Object.entries(styles.customStyles).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`;
      cssVars.push(`${cssVarName}: ${value};`);
    });
  }

  return cssVars.join("\n");
}

export default function CVPreviewPage() {
  const [cv, setCv] = useState<any>(null); // Using any for simplicity here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const cvId = searchParams.get("cvId");

  useEffect(() => {
    if (!cvId) {
      router.push("/dashboard");
      return;
    }

    const fetchCv = async () => {
      try {
        const response = await api.get(`/api/cv/${cvId}`);
        if (!response.data.success) throw new Error("Failed to fetch CV data");
        setCv(response.data.data);
      } catch (err: any) {
        setError(err.message || "Failed to load CV data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCv();
  }, [cvId, router]);

  const generatePreviewHtml = useCallback(() => {
    if (!cv || !cv.template) return "";

    const { template, ...cvData } = cv;
    const cssVars = template.styles
      ? `:root {${stylesToCssVars(template.styles)}}`
      : "";
    const css = `${cssVars}\n${template.templateData.css}`;

    let html = template.templateData.html;
    // Basic placeholder replacement
    for (const [key, value] of Object.entries(cvData.personalDetails)) {
      html = html.replaceAll(`{{personalDetails.${key}}}`, String(value || ""));
    }
    // A proper templating engine is needed for array sections (experience, etc.)

    return `<html><head><style>${css}</style></head><body>${html}</body></html>`;
  }, [cv]);

  const handleDownload = () => {
    window.open(`/api/cv/${cvId}/download`, "_blank");
  };

  const handleEdit = () => {
    router.push(`/cv-builder?cvId=${cvId}`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{cv.title || "CV Preview"}</h1>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={handleEdit}>
            Edit
          </Button>
          <Button onClick={handleDownload}>Download PDF</Button>
          <Link href="/dashboard">
            <Button variant="secondary">Done</Button>
          </Link>
        </div>
      </header>
      <main className="flex-grow p-8">
        <div id="cv-content" className="h-full bg-white shadow-xl rounded-lg">
          <iframe
            srcDoc={generatePreviewHtml()}
            title="CV Preview"
            className="w-full h-full border-0"
          />
        </div>
      </main>
    </div>
  );
}
