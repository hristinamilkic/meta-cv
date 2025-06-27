import api from "./api";

export interface CVData {
  templateId: string;
  data: {
    personalInfo: {
      fullName: string;
      email: string;
      phone?: string;
      location?: string;
      website?: string;
      linkedin?: string;
      github?: string;
      summary?: string;
    };
    education: Array<{
      institution: string;
      degree: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
      location?: string;
    }>;
    experience: Array<{
      company: string;
      position: string;
      startDate?: string;
      endDate?: string;
      description?: string;
      location?: string;
      highlights?: string[];
    }>;
    skills: Array<{
      name: string;
      level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }>;
    languages?: Array<{
      name: string;
      proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }>;
    projects?: Array<{
      name: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      url?: string;
      technologies?: string[];
      highlights?: string[];
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      date?: string;
      expiryDate?: string;
      credentialId?: string;
      credentialUrl?: string;
    }>;
  };
}

const cvService = {
  createCV: async (data: CVData) => {
    const response = await api.post("/cv", data);
    return response.data;
  },

  getUserCVs: async () => {
    const response = await api.get("/cv");
    return response.data;
  },

  getCVById: async (id: string) => {
    const response = await api.get(`/cv/${id}`);
    return response.data;
  },

  updateCV: async (id: string, data: Partial<CVData>) => {
    const response = await api.put(`/cv/${id}`, data);
    return response.data;
  },

  deleteCV: async (id: string) => {
    const response = await api.delete(`/cv/${id}`);
    return response.data;
  },

  downloadCV: async (id: string) => {
    const response = await api.get(`/api/cv/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },

  getCVAnalytics: async () => {
    const response = await api.get("/cv/analytics");
    return response.data;
  },
};

export default cvService;
