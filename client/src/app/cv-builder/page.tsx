"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { ICV } from "@/interfaces/cv.interface";
import Handlebars from "handlebars";

type CVFormData = Omit<
  ICV,
  "_id" | "userId" | "template" | "lastModified" | "createdAt" | "updatedAt"
>;

interface Template {
  _id: string;
  name: string;
  templateData: {
    html: string;
    css: string;
  };
  styles: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
    spacing: string;
    borderRadius: string;
    boxShadow: string;
    colorOptions?: string[];
    customStyles?: Record<string, string>;
  };
  defaultData: CVFormData;
}

const initialCVData: CVFormData = {
  title: "Untitled CV",
  personalDetails: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  isPublic: false,
};

function stylesToCssVars(styles: Template["styles"]) {
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

function renderTemplateHtml(html: string, data: any) {
  const template = Handlebars.compile(html);
  return template(data);
}

export default function CVBuilderPage() {
  const [cvData, setCvData] = useState<CVFormData>(initialCVData);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [renderKey, setRenderKey] = useState(0); // For forcing iframe re-render
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");
  const cvId = searchParams.get("cvId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(
          "Fetching data with cvId:",
          cvId,
          "templateId:",
          templateId
        );

        if (cvId) {
          console.log("Fetching CV with ID:", cvId);
          const cvResponse = await api.get(`/api/cv/${cvId}`);
          console.log("Full CV API response:", cvResponse);

          if (!cvResponse.data.success)
            throw new Error("Failed to load existing CV data.");
          const existingCv = cvResponse.data.data;
          console.log("CV response data:", existingCv);

          const { userId, template: cvTemplate, _id, ...restOfCv } = existingCv;
          console.log("Template from CV:", cvTemplate);
          console.log("Rest of CV data:", restOfCv);

          setCvData(restOfCv);
          setTemplate(cvTemplate);
        } else if (templateId) {
          console.log("Fetching template with ID:", templateId);
          const templateResponse = await api.get(
            `/api/templates/${templateId}`
          );
          console.log("Full template API response:", templateResponse);

          if (!templateResponse.data.success)
            throw new Error("Failed to load template data.");
          const templateData = templateResponse.data.data;
          console.log("Template response data:", templateData);
          setTemplate(templateData);
          // Set cvData to template.defaultData if present
          if (templateData.defaultData) {
            setCvData(templateData.defaultData);
          } else {
            setCvData(initialCVData);
          }
        } else {
          console.log("No cvId or templateId, redirecting to templates");
          router.push("/templates");
          return;
        }
      } catch (err: any) {
        console.error("Error in fetchData:", err);
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cvId, templateId, router]);

  // Add this useEffect to force iframe re-render on cvData change
  useEffect(() => {
    setRenderKey((prev) => prev + 1);
  }, [cvData]);

  const handleDynamicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: keyof CVFormData,
    index?: number
  ) => {
    const { name, value } = e.target;
    setCvData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep copy
      if (index !== undefined && Array.isArray(newData[section])) {
        (newData[section] as any[])[index][name] = value;
      } else if (section === "personalDetails") {
        (newData[section] as any)[name] = value;
      } else {
        newData[name] = value;
      }
      return newData;
    });
    // Force iframe re-render for real-time preview
    setRenderKey((prev) => prev + 1);
  };

  const addSectionItem = (section: keyof CVFormData) => {
    const newItem: any = {
      experience: { company: "", position: "" },
      education: { institution: "", degree: "" },
      skills: { name: "", level: "Intermediate" },
      languages: { name: "", proficiency: "Conversational" },
      projects: { name: "" },
      certifications: { name: "", issuer: "" },
    }[section as string];
    if (newItem) {
      setCvData((prev) => ({
        ...prev,
        [section]: [...(prev[section] as any[]), newItem],
      }));
    }
  };

  const removeSectionItem = (section: keyof CVFormData, index: number) => {
    setCvData((prev) => {
      const arr = [...(prev[section] as any[])];
      arr.splice(index, 1);
      return { ...prev, [section]: arr };
    });
    setRenderKey((prev) => prev + 1);
  };

  const generatePreviewHtml = useCallback(() => {
    if (!template) return "";
    let templateData = template.templateData;
    let styles = template.styles;
    if (!templateData || !templateData.css || !templateData.html) {
      return "<html><body><p>Template data not available</p></body></html>";
    }
    const cssVars = styles ? `:root {${stylesToCssVars(styles)}}` : "";
    const css = `${cssVars}\n${templateData.css}`;
    const html = renderTemplateHtml(templateData.html, cvData);
    return `<html><head><style>${css}</style></head><body>${html}</body></html>`;
  }, [template, cvData]);

  const handleFinishBuild = async () => {
    const payload = {
      templateId: template?._id,
      data: cvData,
      title: cvData.title,
    };
    try {
      const response = cvId
        ? await api.put(`/api/cv/${cvId}`, payload)
        : await api.post("/api/cv", payload);

      if (!response.data.success)
        throw new Error(response.data.message || "Failed to save CV");
      const savedCv = response.data.data;
      router.push(`/cv-preview?cvId=${savedCv._id}`);
    } catch (err: any) {
      setError(err.message || "Failed to save CV.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="flex h-screen">
      <div className="w-1/2 h-full overflow-y-auto p-8 bg-white shadow-lg space-y-8">
        <h1 className="text-3xl font-bold">Build Your CV</h1>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {error}
          </div>
        )}

        <input
          type="text"
          name="title"
          placeholder="CV Title"
          value={cvData.title}
          onChange={(e) => handleDynamicChange(e, "title" as any)}
          className="w-full p-2 border rounded"
        />

        <div>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(cvData.personalDetails).map(([key, value]) => (
              <input
                key={key}
                type="text"
                name={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value || ""}
                onChange={(e) => handleDynamicChange(e, "personalDetails")}
                className="w-full p-2 border rounded col-span-2"
              />
            ))}
          </div>
        </div>

        {[
          {
            label: "Experience",
            section: "experience",
            fields: [
              "company",
              "position",
              "startDate",
              "endDate",
              "description",
              "location",
              "highlights",
            ],
          },
          {
            label: "Education",
            section: "education",
            fields: [
              "institution",
              "degree",
              "fieldOfStudy",
              "startDate",
              "endDate",
              "description",
              "location",
            ],
          },
          { label: "Skills", section: "skills", fields: ["name", "level"] },
          {
            label: "Languages",
            section: "languages",
            fields: ["name", "proficiency"],
          },
          {
            label: "Projects",
            section: "projects",
            fields: [
              "name",
              "description",
              "startDate",
              "endDate",
              "url",
              "technologies",
              "highlights",
            ],
          },
          {
            label: "Certifications",
            section: "certifications",
            fields: [
              "name",
              "issuer",
              "date",
              "expiryDate",
              "credentialId",
              "credentialUrl",
            ],
          },
        ].map(({ label, section, fields }) => (
          <div key={section} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 flex items-center justify-between">
              {label}
              <Button
                type="button"
                onClick={() => addSectionItem(section as keyof CVFormData)}
                size="sm"
              >
                Add
              </Button>
            </h2>
            {(cvData[section as keyof CVFormData] as any[]).map((item, idx) => (
              <div key={idx} className="border rounded p-4 mb-4 relative">
                <Button
                  type="button"
                  onClick={() =>
                    removeSectionItem(section as keyof CVFormData, idx)
                  }
                  className="absolute top-2 right-2"
                >
                  Remove
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  {fields.map((field) => (
                    <input
                      key={field}
                      type="text"
                      name={field}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={item[field] || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, section as keyof CVFormData, idx)
                      }
                      className="w-full p-2 border rounded"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={cvData.isPublic}
            onChange={(e) =>
              setCvData((prev) => ({ ...prev, isPublic: e.target.checked }))
            }
          />
          <label>Make CV Public</label>
        </div>

        <Button onClick={handleFinishBuild} className="w-full mt-8">
          Save & Finish
        </Button>
      </div>
      <div className="w-1/2 h-full p-8">
        <div className="h-full bg-white shadow-xl rounded-lg">
          <iframe
            key={renderKey}
            srcDoc={generatePreviewHtml()}
            title="CV Preview"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
