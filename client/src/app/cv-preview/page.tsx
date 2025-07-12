"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
import api from "@/services/api";

import cvService from "@/services/cv.service";

function stylesToCssVars(styles: any) {
  const cssVars = [];

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

  if (styles.customStyles) {
    Object.entries(styles.customStyles).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`;
      cssVars.push(`${cssVarName}: ${value};`);
    });
  }

  return cssVars.join("\n");
}

export default function CVPreviewPage() {
  const [cv, setCv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
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

  const generatePreviewHtml = useCallback(async () => {
    if (!cv || !cv.template) return "";

    try {
      const { template, ...cvData } = cv;
      const cssVars = template.styles
        ? `:root {${stylesToCssVars(template.styles)}}`
        : "";
      const resetCss = "html,body{margin:0;padding:0;box-sizing:border-box;}";
      const css = `${resetCss}\n${cssVars}\n${template.templateData.css}`;

      const HandlebarsModule = await import("handlebars");
      const Handlebars = HandlebarsModule.default || HandlebarsModule;
      const compiled = Handlebars.compile(template.templateData.html);
      const htmlContent = compiled(cvData);

      return `<html><head><style>${css}</style></head><body>${htmlContent}</body></html>`;
    } catch (error) {
      console.error("Error generating preview HTML:", error);
      return `<html><body><p>Error generating preview: ${error}</p></body></html>`;
    }
  }, [cv]);

  // Generate preview HTML when cv changes
  useEffect(() => {
    if (cv) {
      generatePreviewHtml()
        .then(setPreviewHtml)
        .catch((error) => {
          console.error("Error in preview generation:", error);
          setPreviewHtml(
            `<html><body><p>Error generating preview: ${error}</p></body></html>`
          );
        });
    }
  }, [cv, generatePreviewHtml]);

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
      <div className="min-h-screen flex items-center justify-center"></div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center relative py-16 rounded-xl">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div
          className="w-full max-w-3xl mx-auto flex items-center justify-center"
          style={{ minHeight: "60vh" }}
        >
          <iframe
            srcDoc={previewHtml}
            title="CV Preview"
            className="rounded-3xl max-w-3xl w-full h-[70vh]"
            style={{ background: "transparent" }}
          />
        </div>
      </div>

      <div className="fixed right-24 top-1/2 transform -translate-y-1/2 flex flex-col space-y-8 z-50">
        <Button
          onClick={handleEdit}
          className="bg-[hsl(var(--mc-background))] shadow-lg rounded-xl p-6 hover:bg-[hsl(var(--mc-warm))]"
        >
          <Icon
            name="edit"
            className="!w-8 !h-8 text-[hsl(var(--mc-primary))]"
          />
        </Button>
        <Button
          onClick={() => handleDownload(cvId, cv?.title || "")}
          className="bg-[hsl(var(--mc-background))] shadow-lg rounded-xl p-6 hover:bg-[hsl(var(--mc-warm))] hover:text-white"
        >
          <Icon
            name="download"
            className="!h-8 !w-8 text-[hsl(var(--mc-primary))]"
          />
        </Button>
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-[hsl(var(--mc-background))] shadow-lg rounded-xl p-6 hover:bg-[hsl(var(--mc-warm))]"
        >
          <Icon
            name="done"
            className="!h-8 !w-8 text-[hsl(var(--mc-primary))]"
          />
        </Button>
      </div>
    </div>
  );
}
