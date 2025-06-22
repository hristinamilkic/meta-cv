export interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  location?: string;
}

export interface IExperience {
  company: string;
  position: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  location?: string;
  highlights?: string[];
}

export interface ISkill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface ILanguage {
  name: string;
  proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
}

export interface IProject {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  url?: string;
  technologies?: string[];
  highlights?: string[];
}

export interface ICertification {
  name: string;
  issuer: string;
  date?: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
}

export interface IPersonalDetails {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

export interface ICV {
  _id: string;
  userId: string;
  title: string;
  template: any; // Simplified for client-side
  personalDetails: IPersonalDetails;
  education: IEducation[];
  experience: IExperience[];
  skills: ISkill[];
  languages: ILanguage[];
  projects: IProject[];
  certifications: ICertification[];
  isPublic: boolean;
  lastModified: Date;
  createdAt: Date;
  updatedAt: Date;
}
