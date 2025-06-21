import { Document } from 'mongoose';
export interface SectionLayout {
    position: 'left' | 'right' | 'full';
    order: number;
    width?: string;
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    fontFamily?: string;
    customStyles?: Record<string, string>;
}
export interface Section {
    enabled: boolean;
    layout: SectionLayout;
    required?: boolean;
    maxItems?: number;
    allowMultiple?: boolean;
}
export interface TemplateSections {
    personalDetails: Section;
    experience: Section;
    education: Section;
    websites: Section;
    skills: Section;
    languages: Section;
    courses: Section;
    projects?: Section;
    certifications?: Section;
    achievements?: Section;
    references?: Section;
    customSections?: Record<string, Section>;
}
export interface TemplateStyles {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
    spacing: string;
    borderRadius: string;
    boxShadow: string;
    customStyles?: Record<string, string>;
}
export interface TemplatePreview {
    thumbnail: string;
    previewImages: string[];
    demoUrl?: string;
}
export interface ITemplate extends Document {
    name: string;
    description: string;
    version: string;
    isPremium: boolean;
    isActive: boolean;
    sections: TemplateSections;
    styles: TemplateStyles;
    preview: TemplatePreview;
    templateData: {
        html: string;
        css: string;
        js?: string;
    };
    metadata: {
        author: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        category: string;
        compatibility: string[];
    };
    usage: {
        totalUses: number;
        lastUsed?: Date;
        rating?: number;
    };
}
//# sourceMappingURL=template.interface.d.ts.map