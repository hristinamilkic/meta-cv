import { ITemplate } from "../interfaces/template.interface";
interface CVDataForPDF {
    personalDetails: Record<string, any>;
    education: any[];
    experience: any[];
    skills: any[];
    languages: any[];
    projects: any[];
    certifications: any[];
    title?: string;
}
export declare class PDFService {
    static generatePDF(cv: CVDataForPDF, template: ITemplate): Promise<Buffer>;
}
export {};
//# sourceMappingURL=pdf.service.d.ts.map