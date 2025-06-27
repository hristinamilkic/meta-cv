"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/services/api";
import Handlebars from "handlebars";
import cvService from "@/services/cv.service";

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
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorDialog, setErrorDialog] = useState<string | null>(null);

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

    // Compile the template HTML with Handlebars
    const compiled = Handlebars.compile(template.templateData.html);
    const htmlContent = compiled(cvData);

    return `<html><head><style>${css}</style></head><body>${htmlContent}</body></html>`;
  }, [cv]);

  const handleDownload = async (cvId: string, title: string) => {
    setActionLoading(cvId + "-download");
    try {
      const blob = await cvService.downloadCV(cvId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.download =
        (title ? title.replace(/[^a-zA-Z0-9-_\. ]/g, "_") : "CV") + ".pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErrorDialog("Failed to download CV.");
    } finally {
      setActionLoading(null);
    }
  };

  if (!cvId) return;
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
    <div className="min-h-screen flex items-center justify-center bg-[#2d033b] relative">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div
          className="w-full h-full max-w-3xl mx-auto bg-transparent flex items-center justify-center"
          style={{ minHeight: "80vh" }}
        >
          <iframe
            srcDoc={generatePreviewHtml()}
            title="CV Preview"
            className="w-full h-[80vh] border-0 rounded-2xl shadow-2xl"
            style={{ background: "transparent" }}
          />
        </div>
      </div>
      {/* Floating action buttons */}
      <div className="fixed right-24 top-1/2 transform -translate-y-1/2 flex flex-col space-y-8 z-50">
        <Button
          onClick={handleEdit}
          size="icon"
          className="bg-white shadow-lg rounded-full p-4 hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#810ca8]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3h3z"
            />
          </svg>
        </Button>
        <Button
          onClick={() => handleDownload(cvId, cv?.title || "")}
          size="icon"
          className="bg-white shadow-lg rounded-full p-4 hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#810ca8]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
            />
          </svg>
        </Button>
        <Button
          onClick={() => router.push("/dashboard")}
          size="icon"
          className="bg-white shadow-lg rounded-full p-4 hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#810ca8]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
