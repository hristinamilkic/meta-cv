import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    projects: mongoose.Types.DocumentArray<{
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }> & {
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }>;
    certifications: mongoose.Types.DocumentArray<{
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }> & {
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }>;
    experience: mongoose.Types.DocumentArray<{
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }> & {
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }>;
    education: mongoose.Types.DocumentArray<{
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }> & {
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }>;
    skills: mongoose.Types.DocumentArray<{
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }> & {
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }>;
    languages: mongoose.Types.DocumentArray<{
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }> & {
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }>;
    title: string;
    isPublic: boolean;
    lastModified: NativeDate;
    personalDetails?: {
        email: string;
        fullName: string;
        phone?: string | null | undefined;
        location?: string | null | undefined;
        website?: string | null | undefined;
        linkedin?: string | null | undefined;
        github?: string | null | undefined;
        summary?: string | null | undefined;
        profileImage?: string | null | undefined;
    } | null | undefined;
    thumbnail?: string | null | undefined;
    template?: mongoose.Types.ObjectId | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    projects: mongoose.Types.DocumentArray<{
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }> & {
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }>;
    certifications: mongoose.Types.DocumentArray<{
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }> & {
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }>;
    experience: mongoose.Types.DocumentArray<{
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }> & {
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }>;
    education: mongoose.Types.DocumentArray<{
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }> & {
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }>;
    skills: mongoose.Types.DocumentArray<{
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }> & {
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }>;
    languages: mongoose.Types.DocumentArray<{
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }> & {
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }>;
    title: string;
    isPublic: boolean;
    lastModified: NativeDate;
    personalDetails?: {
        email: string;
        fullName: string;
        phone?: string | null | undefined;
        location?: string | null | undefined;
        website?: string | null | undefined;
        linkedin?: string | null | undefined;
        github?: string | null | undefined;
        summary?: string | null | undefined;
        profileImage?: string | null | undefined;
    } | null | undefined;
    thumbnail?: string | null | undefined;
    template?: mongoose.Types.ObjectId | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    projects: mongoose.Types.DocumentArray<{
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }> & {
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }>;
    certifications: mongoose.Types.DocumentArray<{
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }> & {
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }>;
    experience: mongoose.Types.DocumentArray<{
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }> & {
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }>;
    education: mongoose.Types.DocumentArray<{
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }> & {
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }>;
    skills: mongoose.Types.DocumentArray<{
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }> & {
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }>;
    languages: mongoose.Types.DocumentArray<{
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }> & {
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }>;
    title: string;
    isPublic: boolean;
    lastModified: NativeDate;
    personalDetails?: {
        email: string;
        fullName: string;
        phone?: string | null | undefined;
        location?: string | null | undefined;
        website?: string | null | undefined;
        linkedin?: string | null | undefined;
        github?: string | null | undefined;
        summary?: string | null | undefined;
        profileImage?: string | null | undefined;
    } | null | undefined;
    thumbnail?: string | null | undefined;
    template?: mongoose.Types.ObjectId | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    projects: mongoose.Types.DocumentArray<{
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }> & {
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }>;
    certifications: mongoose.Types.DocumentArray<{
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }> & {
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }>;
    experience: mongoose.Types.DocumentArray<{
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }> & {
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }>;
    education: mongoose.Types.DocumentArray<{
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }> & {
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }>;
    skills: mongoose.Types.DocumentArray<{
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }> & {
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }>;
    languages: mongoose.Types.DocumentArray<{
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }> & {
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }>;
    title: string;
    isPublic: boolean;
    lastModified: NativeDate;
    personalDetails?: {
        email: string;
        fullName: string;
        phone?: string | null | undefined;
        location?: string | null | undefined;
        website?: string | null | undefined;
        linkedin?: string | null | undefined;
        github?: string | null | undefined;
        summary?: string | null | undefined;
        profileImage?: string | null | undefined;
    } | null | undefined;
    thumbnail?: string | null | undefined;
    template?: mongoose.Types.ObjectId | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    projects: mongoose.Types.DocumentArray<{
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }> & {
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }>;
    certifications: mongoose.Types.DocumentArray<{
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }> & {
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }>;
    experience: mongoose.Types.DocumentArray<{
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }> & {
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }>;
    education: mongoose.Types.DocumentArray<{
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }> & {
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }>;
    skills: mongoose.Types.DocumentArray<{
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }> & {
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }>;
    languages: mongoose.Types.DocumentArray<{
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }> & {
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }>;
    title: string;
    isPublic: boolean;
    lastModified: NativeDate;
    personalDetails?: {
        email: string;
        fullName: string;
        phone?: string | null | undefined;
        location?: string | null | undefined;
        website?: string | null | undefined;
        linkedin?: string | null | undefined;
        github?: string | null | undefined;
        summary?: string | null | undefined;
        profileImage?: string | null | undefined;
    } | null | undefined;
    thumbnail?: string | null | undefined;
    template?: mongoose.Types.ObjectId | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    projects: mongoose.Types.DocumentArray<{
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }> & {
        name: string;
        highlights: string[];
        technologies: string[];
        description?: string | null | undefined;
        url?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
    }>;
    certifications: mongoose.Types.DocumentArray<{
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }> & {
        name: string;
        issuer: string;
        date?: NativeDate | null | undefined;
        expiryDate?: NativeDate | null | undefined;
        credentialId?: string | null | undefined;
        credentialUrl?: string | null | undefined;
    }>;
    experience: mongoose.Types.DocumentArray<{
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }> & {
        position: string;
        company: string;
        highlights: string[];
        description?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }>;
    education: mongoose.Types.DocumentArray<{
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }> & {
        institution: string;
        degree: string;
        description?: string | null | undefined;
        fieldOfStudy?: string | null | undefined;
        startDate?: NativeDate | null | undefined;
        endDate?: NativeDate | null | undefined;
        location?: string | null | undefined;
    }>;
    skills: mongoose.Types.DocumentArray<{
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }> & {
        name: string;
        level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }>;
    languages: mongoose.Types.DocumentArray<{
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }> & {
        name: string;
        proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    }>;
    title: string;
    isPublic: boolean;
    lastModified: NativeDate;
    personalDetails?: {
        email: string;
        fullName: string;
        phone?: string | null | undefined;
        location?: string | null | undefined;
        website?: string | null | undefined;
        linkedin?: string | null | undefined;
        github?: string | null | undefined;
        summary?: string | null | undefined;
        profileImage?: string | null | undefined;
    } | null | undefined;
    thumbnail?: string | null | undefined;
    template?: mongoose.Types.ObjectId | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=CV.model.d.ts.map