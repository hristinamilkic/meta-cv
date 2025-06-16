"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
}

export default function CVPreviewPage() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        const response = await fetch("/api/cv");
        if (!response.ok) {
          throw new Error("Failed to fetch CV data");
        }
        const data = await response.json();
        setCvData(data);
      } catch (err) {
        setError("Failed to load CV data");
      } finally {
        setLoading(false);
      }
    };

    fetchCVData();
  }, []);

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/cv/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cvData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cvData?.personalInfo.firstName}-${cvData?.personalInfo.lastName}-CV.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to download CV");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">
          No CV data available. Please create your CV first.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CV Preview</h1>
            <p className="mt-2 text-sm text-gray-600">
              Preview and download your professional CV
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Download PDF
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
              <div>{cvData.personalInfo.email}</div>
              <div>{cvData.personalInfo.phone}</div>
              <div>{cvData.personalInfo.location}</div>
            </div>
          </div>

          {/* Education */}
          {cvData.education.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Education
              </h3>
              <div className="space-y-4">
                {cvData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-indigo-500 pl-4"
                  >
                    <div className="font-medium text-gray-900">
                      {edu.institution}
                    </div>
                    <div className="text-sm text-gray-600">
                      {edu.degree} in {edu.field}
                    </div>
                    <div className="text-sm text-gray-500">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {cvData.experience.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Work Experience
              </h3>
              <div className="space-y-6">
                {cvData.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="font-medium text-gray-900">
                      {exp.position}
                    </div>
                    <div className="text-sm text-gray-600">{exp.company}</div>
                    <div className="text-sm text-gray-500 mb-2">
                      {exp.startDate} - {exp.endDate}
                    </div>
                    <div className="text-sm text-gray-600 whitespace-pre-line">
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {cvData.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
