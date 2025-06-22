"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CV {
  _id: string;
  user: string;
  template: string; 
  cvData: any;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCvs = async () => {
      try {
        const response = await fetch("/api/cv");
        if (!response.ok) {
          throw new Error("Failed to fetch CVs");
        }
        const data = await response.json();
        setCvs(data);
      } catch (err) {
        setError("Failed to load CVs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCvs();
    }
  }, [user]);

  const handleEdit = (cvId: string) => {
    // We need to know which template this CV uses to redirect to the correct builder
    // This information should be available in the CV object
    const cv = cvs.find((c) => c._id === cvId);
    if (cv) {
      router.push(`/cv-builder?cvId=${cvId}&templateId=${cv.template}`);
    } else {
      setError("Could not find CV details to edit.");
    }
  };

  const handleDelete = async (cvId: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) {
      return;
    }

    try {
      const response = await fetch(`/api/cv/${cvId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete CV");
      }
      setCvs(cvs.filter((cv) => cv._id !== cvId));
    } catch (err) {
      setError("Failed to delete CV.");
      console.error(err);
    }
  };

  const handleDownload = (cvId: string) => {
    // This will point to the download route on the server
    window.open(`/api/cvs/${cvId}/download`, "_blank");
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Link href="/templates">
              <Button>Create New CV</Button>
            </Link>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {cvs.length > 0 ? (
                cvs.map((cv) => (
                  <li key={cv._id}>
                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium text-indigo-600 truncate">
                          CV {cv._id}
                        </p>
                        <p className="text-sm text-gray-500">
                          Last updated on{" "}
                          {new Date(cv.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(cv._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(cv._id)}
                        >
                          Download
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(cv._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  You haven't created any CVs yet.
                </li>
              )}
            </ul>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
