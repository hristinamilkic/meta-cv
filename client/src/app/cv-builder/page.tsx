"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { ICV } from "@/interfaces/cv.interface";
import Handlebars from "handlebars";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon } from "lucide-react";

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

function renderTemplateHtml(html: string, data: any) {
  const template = Handlebars.compile(html);
  return template(data);
}

function formatDate(date: Date | string | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRange(range: { from?: Date | string; to?: Date | string }) {
  if (!range.from && !range.to) return "Select date range";
  if (range.from && range.to)
    return `${formatDate(range.from)} - ${formatDate(range.to)}`;
  if (range.from) return `${formatDate(range.from)} - ...`;
  if (range.to) return `... - ${formatDate(range.to)}`;
  return "Select date range";
}

function DatePicker({
  value,
  onChange,
  mode = "single",
  placeholder = "Pick a date",
  ...props
}: {
  value: Date | { from?: Date; to?: Date } | undefined;
  onChange: (date: any) => void;
  mode?: "single" | "range";
  placeholder?: string;
  [key: string]: any;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full justify-between font-normal bg-transparent border border-[hsl(var(--mc-warm))] text-white">
          {mode === "single"
            ? value && value instanceof Date
              ? formatDate(value)
              : value && typeof value === "string"
                ? formatDate(new Date(value))
                : placeholder
            : isRangeObject(value)
              ? formatRange(value)
              : placeholder}
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        {mode === "range" ? (
          <Calendar
            mode={mode}
            selected={
              isRangeObject(value) ? value : { from: undefined, to: undefined }
            }
            onSelect={(date: any) => {
              onChange(date);
              if (date?.to) setOpen(false);
            }}
            captionLayout="dropdown"
            initialFocus
            required={false}
            {...props}
          />
        ) : (
          <Calendar
            mode={mode}
            selected={value instanceof Date ? value : undefined}
            onSelect={(date: any) => {
              onChange(date);
              setOpen(false);
            }}
            captionLayout="dropdown"
            initialFocus
            {...props}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

function isRangeObject(
  val: any
): val is { from: Date | undefined; to: Date | undefined } {
  return val && typeof val === "object" && ("from" in val || "to" in val);
}

function parseDatesInCVData(data: any): any {
  if (!data) return data;
  const parseDate = (d: any) => {
    if (!d) return d;
    if (typeof d === "string" && !isNaN(Date.parse(d))) return new Date(d);
    return d;
  };
  const clone = JSON.parse(JSON.stringify(data));
  ["experience", "education", "projects"].forEach((section) => {
    if (Array.isArray(clone[section])) {
      clone[section] = clone[section].map((item: any) => ({
        ...item,
        startDate: item.startDate ? parseDate(item.startDate) : undefined,
        endDate: item.endDate ? parseDate(item.endDate) : undefined,
      }));
    }
  });
  if (Array.isArray(clone.certifications)) {
    clone.certifications = clone.certifications.map((item: any) => ({
      ...item,
      date: parseDate(item.date),
      expiryDate: parseDate(item.expiryDate),
    }));
  }
  return clone;
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
          if (templateData.defaultData) {
            setCvData(parseDatesInCVData(templateData.defaultData));
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

  useEffect(() => {
    setRenderKey((prev) => prev + 1);
  }, [cvData]);

  const handleDynamicChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: any } },
    section: keyof CVFormData,
    index?: number
  ) => {
    const { name, value } = e.target;
    setCvData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep copy
      if (index !== undefined && Array.isArray(newData[section])) {
        if (isRangeObject(value)) {
          const prevRange = (newData[section] as any[])[index][name] || {};
          (newData[section] as any[])[index][name] = {
            from: value.from !== undefined ? value.from : prevRange.from,
            to: value.to !== undefined ? value.to : prevRange.to,
          };
        } else {
          (newData[section] as any[])[index][name] = value;
        }
      } else if (section === "personalDetails") {
        (newData[section] as any)[name] = value;
      } else {
        newData[name] = value;
      }
      return newData;
    });
    setRenderKey((prev) => prev + 1);
  };

  const addSectionItem = (section: keyof CVFormData) => {
    const newItem: any = {
      experience: {
        company: "",
        position: "",
        startDate: undefined,
        endDate: undefined,
      },
      education: {
        institution: "",
        degree: "",
        startDate: undefined,
        endDate: undefined,
      },
      skills: { name: "", level: "Intermediate" },
      languages: { name: "", proficiency: "Conversational" },
      projects: { name: "", startDate: undefined, endDate: undefined },
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        setCvData((prev) => ({
          ...prev,
          personalDetails: {
            ...prev.personalDetails,
            profileImage: reader.result as string,
          },
        }));
        setRenderKey((prev) => prev + 1);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCVDataForPreview = (cvData: CVFormData) => {
    const clone = JSON.parse(JSON.stringify(cvData));
    const formatSection = (
      arr: any[],
      startField: string,
      endField: string,
      joinLabel: string
    ) =>
      arr.map((item) => {
        const newItem = { ...item };
        if (newItem[startField])
          newItem[startField] = formatDate(newItem[startField]);
        if (newItem[endField])
          newItem[endField] = formatDate(newItem[endField]);
        if (newItem[startField] || newItem[endField]) {
          newItem[`${startField}To${endField}`] =
            `${newItem[startField] || ""} - ${newItem[endField] || ""}`;
        }
        return newItem;
      });
    if (clone.experience)
      clone.experience = formatSection(
        clone.experience,
        "startDate",
        "endDate",
        "Experience Dates"
      );
    if (clone.education)
      clone.education = formatSection(
        clone.education,
        "startDate",
        "endDate",
        "Education Dates"
      );
    if (clone.projects)
      clone.projects = formatSection(
        clone.projects,
        "startDate",
        "endDate",
        "Project Dates"
      );
    if (clone.certifications)
      clone.certifications = clone.certifications.map((item: any) => ({
        ...item,
        date: formatDate(item.date),
        expiryDate: formatDate(item.expiryDate),
      }));
    return clone;
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
      ...formatCVDataForPreview(cvData),
    });
    return `<html><head><style>${css}</style></head><body>${html}</body></html>`;
  }, [template, cvData]);

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
        response = await api.put(`/api/cv/${cvId}`, payload);
      } else {
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
              <p className="text-center text-white mb-8">
                Here you can edit your personal details.
              </p>
              <form
                className="space-y-8 overflow-y-auto custom-scrollbar flex-1 p-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="mb-4">
                  <Label htmlFor="cvTitle" className="mb-2">
                    CV Name
                  </Label>
                  <Input
                    id="cvTitle"
                    name="title"
                    placeholder="CV Name"
                    value={cvData.title || ""}
                    onChange={(e) =>
                      setCvData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="mb-2">
                      Full name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Full name"
                      value={cvData.personalDetails.fullName || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, "personalDetails")
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="mb-2">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Phone"
                      value={cvData.personalDetails.phone || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, "personalDetails")
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="mb-2">
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Location"
                      value={cvData.personalDetails.location || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, "personalDetails")
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="mb-2">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Email address"
                      value={cvData.personalDetails.email || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, "personalDetails")
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="website" className="mb-2">
                      Website
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      placeholder="Website"
                      value={cvData.personalDetails.website || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, "personalDetails")
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="summary" className="mb-2">
                      Summary
                    </Label>
                    <Textarea
                      id="summary"
                      name="summary"
                      placeholder="Summary"
                      value={cvData.personalDetails.summary || ""}
                      onChange={(e) =>
                        handleDynamicChange(e, "personalDetails")
                      }
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

                {[
                  {
                    label: "Experience",
                    section: "experience",
                    fields: [
                      { name: "company", type: "text" },
                      { name: "position", type: "text" },
                      { name: "startDate", type: "single" },
                      { name: "endDate", type: "single" },
                      { name: "location", type: "text" },
                      { name: "description", type: "textarea" },
                      { name: "highlights", type: "textarea" },
                    ],
                  },
                  {
                    label: "Education",
                    section: "education",
                    fields: [
                      { name: "institution", type: "text" },
                      { name: "degree", type: "text" },
                      { name: "fieldOfStudy", type: "text" },
                      { name: "startDate", type: "single" },
                      { name: "endDate", type: "single" },
                      { name: "location", type: "text" },
                      { name: "description", type: "textarea" },
                    ],
                  },
                  {
                    label: "Skills",
                    section: "skills",
                    fields: [
                      { name: "name", type: "text" },
                      { name: "level", type: "text" },
                    ],
                  },
                  {
                    label: "Languages",
                    section: "languages",
                    fields: [
                      { name: "name", type: "text" },
                      { name: "proficiency", type: "text" },
                    ],
                  },
                  {
                    label: "Projects",
                    section: "projects",
                    fields: [
                      { name: "name", type: "text" },
                      { name: "startDate", type: "single" },
                      { name: "endDate", type: "single" },
                      { name: "description", type: "textarea" },
                      { name: "url", type: "text" },
                      { name: "technologies", type: "text" },
                      { name: "highlights", type: "textarea" },
                    ],
                  },
                  {
                    label: "Certifications",
                    section: "certifications",
                    fields: [
                      { name: "name", type: "text" },
                      { name: "issuer", type: "text" },
                      { name: "date", type: "single" },
                      { name: "expiryDate", type: "single" },
                      { name: "credentialId", type: "text" },
                      { name: "credentialUrl", type: "text" },
                    ],
                  },
                ].map(({ label, section, fields }) => (
                  <div key={section} className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 border-b border-[hsl(var(--mc-warm))] pb-2 flex items-center justify-between text-white">
                      {label}
                      <Button
                        type="button"
                        onClick={() =>
                          addSectionItem(section as keyof CVFormData)
                        }
                        className="text-sm w-1/3"
                      >
                        Add
                      </Button>
                    </h2>
                    {(cvData[section as keyof CVFormData] as any[]).map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="border border-[hsl(var(--mc-warm))] rounded-xl p-4 mb-4 relative bg-[#2d033b]"
                        >
                          <Button
                            type="button"
                            onClick={() =>
                              removeSectionItem(
                                section as keyof CVFormData,
                                idx
                              )
                            }
                            className="mb-4"
                          >
                            Remove
                          </Button>
                          <div className="grid grid-cols-2 gap-4">
                            {fields.map((fieldObj) => {
                              const field = fieldObj.name;
                              const type = fieldObj.type;
                              if (type === "text") {
                                return (
                                  <div
                                    key={field}
                                    className="flex flex-col gap-1"
                                  >
                                    <Label
                                      htmlFor={`${section}-${field}-${idx}`}
                                    >
                                      {field.charAt(0).toUpperCase() +
                                        field.slice(1)}
                                    </Label>
                                    <Input
                                      id={`${section}-${field}-${idx}`}
                                      name={field}
                                      placeholder={
                                        field.charAt(0).toUpperCase() +
                                        field.slice(1)
                                      }
                                      value={item[field] || ""}
                                      onChange={(e) =>
                                        handleDynamicChange(
                                          e,
                                          section as keyof CVFormData,
                                          idx
                                        )
                                      }
                                    />
                                  </div>
                                );
                              }
                              if (type === "textarea") {
                                return (
                                  <div
                                    key={field}
                                    className="col-span-2 flex flex-col gap-1"
                                  >
                                    <Label
                                      htmlFor={`${section}-${field}-${idx}`}
                                    >
                                      {field.charAt(0).toUpperCase() +
                                        field.slice(1)}
                                    </Label>
                                    <Textarea
                                      id={`${section}-${field}-${idx}`}
                                      name={field}
                                      placeholder={
                                        field.charAt(0).toUpperCase() +
                                        field.slice(1)
                                      }
                                      value={item[field] || ""}
                                      onChange={(e) =>
                                        handleDynamicChange(
                                          e,
                                          section as keyof CVFormData,
                                          idx
                                        )
                                      }
                                      rows={3}
                                      className="border border-[hsl(var(--mc-warm))]"
                                    />
                                  </div>
                                );
                              }
                              if (type === "single") {
                                return (
                                  <div
                                    key={field}
                                    className="flex flex-col gap-1"
                                  >
                                    <Label
                                      htmlFor={`${section}-${field}-${idx}`}
                                    >
                                      {field.charAt(0).toUpperCase() +
                                        field.slice(1)}
                                    </Label>
                                    <DatePicker
                                      mode="single"
                                      value={item[field] || undefined}
                                      onChange={(date) => {
                                        const e = {
                                          target: { name: field, value: date },
                                        };
                                        handleDynamicChange(
                                          e as any,
                                          section as keyof CVFormData,
                                          idx
                                        );
                                      }}
                                      placeholder="Select date"
                                    />
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleFinishBuild}
                  className="w-full mt-8 "
                >
                  Save & Finish
                </Button>
              </form>
            </div>
          </div>
          <div className="w-2/3 h-full flex items-center justify-center">
            <div className="w-full h-full overflow-y-auto bg-transparent">
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
