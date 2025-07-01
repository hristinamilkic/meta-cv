import api from "./api";

export interface TemplateData {
  name: string;
  description: string;
  isPremium: boolean;
  sections: {
    personalDetails: {
      enabled: boolean;
      layout: {
        position: "left" | "right" | "full";
        order: number;
      };
    };
    experience: {
      enabled: boolean;
      layout: {
        position: "left" | "right" | "full";
        order: number;
      };
    };
    education: {
      enabled: boolean;
      layout: {
        position: "left" | "right" | "full";
        order: number;
      };
    };
    skills: {
      enabled: boolean;
      layout: {
        position: "left" | "right" | "full";
        order: number;
      };
    };
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
  };
  templateData: {
    html: string;
    css: string;
    js?: string;
  };
}

const templateService = {
  getTemplates: async () => {
    const response = await api.get("/templates");
    return response.data;
  },

  getTemplate: async (id: string) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  createTemplate: async (data: TemplateData) => {
    const response = await api.post("/templates", data);
    return response.data;
  },

  deleteTemplate: async (id: string) => {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  },
};

export default templateService;
