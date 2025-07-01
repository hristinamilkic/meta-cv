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
  const [renderKey, setRenderKey] = useState(0); 
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
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

  // Handle profile photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        setCvData((prev) => ({
          ...prev,
          profilePhoto: reader.result as string,
        }));
        setRenderKey((prev) => prev + 1);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePreviewHtml = useCallback(() => {
    if (!template) return "";
    let templateData = template.templateData;
    let styles = template.styles;
    if (!templateData || !templateData.css || !templateData.html) {
      return "<html><body><p>Template data not available</p></body></html>";
    }
    const cssVars = styles ? `:root {${stylesToCssVars(styles)}}` : "";
    const css = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&display=swap');\nbody, * { font-family: 'Montserrat', Arial, sans-serif !important; }\n${cssVars}\n${templateData.css}`;
    const html = renderTemplateHtml(templateData.html, {
      ...cvData,
      profilePhoto,
    });
    return `<html><head><style>${css}</style></head><body>${html}</body></html>`;
  }, [template, cvData, profilePhoto]);

  const handleFinishBuild = async () => {
    const payload = {
      templateId: template?._id,
      data: cvData,
      title: cvData.title,
    };
    setLoading(true);
    setError("");
    try {
      let response;
      if (cvId) {
        // Editing existing CV: use PUT
        response = await api.put(`/api/cv/${cvId}`, payload);
      } else {
        // Creating new CV: use POST
        response = await api.post("/api/cv", payload);
      }

      if (!response.data.success)
        throw new Error(response.data.message || "Failed to save CV");
      const savedCv = response.data.data;
      router.push(`/cv-preview?cvId=${savedCv._id}`);
    } catch (err: any) {
      setError(err.message || "Failed to save CV.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="animate-spin border-pink-500 min-h-screen flex items-center justify-center"></div>
    );
  return (
    <div className="flex items-center justify-center mt-24">
      <div className="w-full h-[calc(100vh-220px)] flex flex-row px-4">
        <div className="flex h-full w-full max-w-7xl mx-auto gap-6">
          {/* Left: Form */}
          <div className="w-1/3 h-full flex">
            <div className="w-full h-full max-w-xl mx-auto p-8 rounded-3xl bg-[#2d033b] shadow-2xl flex flex-col">
              <h2 className="text-3xl font-bold text-center text-white mb-2">
                Edit your personal details
              </h2>
              <p className="text-center text-[#c7a0e7] mb-8">
                Here you can edit your personal details.
              </p>
              <form
                className="space-y-8 overflow-y-auto custom-scrollbar flex-1 p-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#c7a0e7] mb-2">
                      Full name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full name"
                      value={cvData.personalDetails.fullName || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, "personalDetails")
                      }
                      className="w-full rounded-xl bg-[#2d033b] text-white border border-[#810ca8] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c7a0e7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#c7a0e7] mb-2">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      value={cvData.personalDetails.phone || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, "personalDetails")
                      }
                      className="w-full rounded-xl bg-[#2d033b] text-white border border-[#810ca8] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c7a0e7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#c7a0e7] mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Location"
                      value={cvData.personalDetails.location || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, "personalDetails")
                      }
                      className="w-full rounded-xl bg-[#2d033b] text-white border border-[#810ca8] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c7a0e7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#c7a0e7] mb-2">
                      Email address
                    </label>
                    <input
                      type="text"
                      name="email"
                      placeholder="Email address"
                      value={cvData.personalDetails.email || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, "personalDetails")
                      }
                      className="w-full rounded-xl bg-[#2d033b] text-white border border-[#810ca8] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c7a0e7]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[#c7a0e7] mb-2">Website</label>
                    <input
                      type="text"
                      name="website"
                      placeholder="Website"
                      value={cvData.personalDetails.website || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, "personalDetails")
                      }
                      className="w-full rounded-xl bg-[#2d033b] text-white border border-[#810ca8] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c7a0e7]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[#c7a0e7] mb-2">Summary</label>
                    <textarea
                      name="summary"
                      placeholder="Summary"
                      value={cvData.personalDetails.summary || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, "personalDetails")
                      }
                      className="w-full rounded-xl bg-[#2d033b] text-white border border-[#810ca8] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c7a0e7] resize-none"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-lg text-white font-semibold mb-2">
                    Change your photo
                  </h3>
                  <p className="text-[#c7a0e7] mb-4">
                    It's very important to upload your image to your cv.
                  </p>
                  {profilePhoto && (
                    <img
                      src={profilePhoto}
                      alt="Profile Preview"
                      className="mx-auto mb-4 rounded-full object-cover"
                      style={{ width: 96, height: 96 }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="mb-4 block mx-auto text-white"
                  />
                </div>

                {/* Restore all original sections below, styled to match */}
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
                  {
                    label: "Skills",
                    section: "skills",
                    fields: ["name", "level"],
                  },
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
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2 flex items-center justify-between text-white">
                      {label}
                      <Button
                        type="button"
                        onClick={() =>
                          addSectionItem(section as keyof CVFormData)
                        }
                        size="sm"
                        className="bg-[#810ca8] hover:bg-[#c7a0e7] text-white font-bold rounded-xl"
                      >
                        Add
                      </Button>
                    </h2>
                    {(cvData[section as keyof CVFormData] as any[]).map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="border border-[#810ca8] rounded-xl p-4 mb-4 relative bg-[#2d033b]"
                        >
                          <Button
                            type="button"
                            onClick={() =>
                              removeSectionItem(
                                section as keyof CVFormData,
                                idx
                              )
                            }
                            className=" bg-[#810ca8] hover:bg-[#c7a0e7] text-white font-bold rounded-xl"
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
                                  handleDynamicChange(
                                    e,
                                    section as keyof CVFormData,
                                    idx
                                  )
                                }
                                className="w-full rounded-xl bg-[#22023a] text-white border border-[#810ca8] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c7a0e7]"
                              />
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleFinishBuild}
                  className="w-full mt-8 bg-[#810ca8] hover:bg-[#c7a0e7] text-white font-bold py-3 rounded-xl transition-all duration-200"
                >
                  Save & Finish
                </Button>
              </form>
            </div>
          </div>
          {/* Right: Preview */}
          <div className="w-2/3 h-full flex items-center justify-center">
            <div className="w-full h-full overflow-y-auto bg-white rounded-3xl">
              <iframe
                key={renderKey}
                srcDoc={generatePreviewHtml()}
                title="CV Preview"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            background: #2d033b;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #810ca8;
            border-radius: 8px;
          }
        `}</style>
      </div>
    </div>
  );
}
