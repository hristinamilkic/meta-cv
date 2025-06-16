"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
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

export default function DashboardPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back, {user?.firstName}!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Quick Actions
              </h3>
              <div className="mt-4 space-y-4">
                <Link
                  href="/cv-builder"
                  className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Edit CV
                </Link>
                <Link
                  href="/templates"
                  className="block w-full text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Browse Templates
                </Link>
                <Link
                  href="/cv-preview"
                  className="block w-full text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Preview CV
                </Link>
              </div>
            </div>
          </div>

          {/* CV Summary */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">CV Summary</h3>
              {cvData ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Personal Info
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {cvData.personalInfo.firstName}{" "}
                      {cvData.personalInfo.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {cvData.personalInfo.email}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Education
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {cvData.education.length} entries
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Experience
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {cvData.experience.length} entries
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Skills
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {cvData.skills.length} skills listed
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-500">
                  No CV data available. Start by creating your CV!
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Activity
              </h3>
              <div className="mt-4 space-y-4">
                <div className="text-sm text-gray-500">
                  No recent activity to display.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
