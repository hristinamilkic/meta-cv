import mongoose from "mongoose";
import Template from "../src/models/template.model";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/meta-cv";

const sampleTemplates = [
  {
    name: "Professional Classic",
    description:
      "A clean and professional template perfect for corporate environments",
    version: "1.0.0",
    isPremium: false,
    isActive: true,
    sections: {
      personalDetails: {
        enabled: true,
        layout: { position: "full", order: 1 },
        required: true,
      },
      experience: {
        enabled: true,
        layout: { position: "left", order: 2 },
        required: true,
      },
      education: {
        enabled: true,
        layout: { position: "right", order: 3 },
        required: true,
      },
      skills: {
        enabled: true,
        layout: { position: "left", order: 4 },
        required: true,
      },
      languages: {
        enabled: true,
        layout: { position: "right", order: 5 },
        required: false,
      },
      websites: {
        enabled: true,
        layout: { position: "left", order: 6 },
        required: false,
      },
      courses: {
        enabled: true,
        layout: { position: "right", order: 7 },
        required: false,
      },
      projects: {
        enabled: true,
        layout: { position: "full", order: 8 },
        required: false,
      },
      certifications: {
        enabled: true,
        layout: { position: "left", order: 9 },
        required: false,
      },
      references: {
        enabled: true,
        layout: { position: "right", order: 10 },
        required: false,
      },
    },
    styles: {
      primaryColor: "#2563eb",
      secondaryColor: "#1e40af",
      backgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      spacing: "1.5rem",
      borderRadius: "4px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    preview: {
      thumbnail:
        "https://via.placeholder.com/400x300/2563eb/ffffff?text=Professional+Classic",
      previewImages: [
        "https://via.placeholder.com/800x600/2563eb/ffffff?text=Professional+Classic+Preview",
      ],
    },
    templateData: {
      html: "<div class='cv-template'>Professional Classic Template HTML</div>",
      css: ".cv-template { color: #2563eb; }",
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["professional", "corporate", "clean"],
      category: "professional",
      compatibility: ["modern browsers"],
    },
  },
  {
    name: "Creative Modern",
    description:
      "A bold and creative template for designers and creative professionals",
    version: "1.0.0",
    isPremium: true,
    isActive: true,
    sections: {
      personalDetails: {
        enabled: true,
        layout: { position: "full", order: 1 },
        required: true,
      },
      experience: {
        enabled: true,
        layout: { position: "left", order: 2 },
        required: true,
      },
      education: {
        enabled: true,
        layout: { position: "right", order: 3 },
        required: true,
      },
      skills: {
        enabled: true,
        layout: { position: "full", order: 4 },
        required: true,
      },
      languages: {
        enabled: true,
        layout: { position: "right", order: 5 },
        required: false,
      },
      websites: {
        enabled: true,
        layout: { position: "left", order: 6 },
        required: false,
      },
      courses: {
        enabled: true,
        layout: { position: "right", order: 7 },
        required: false,
      },
      projects: {
        enabled: true,
        layout: { position: "full", order: 8 },
        required: false,
      },
    },
    styles: {
      primaryColor: "#ec4899",
      secondaryColor: "#be185d",
      backgroundColor: "#fdf2f8",
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      spacing: "2rem",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    preview: {
      thumbnail:
        "https://via.placeholder.com/400x300/ec4899/ffffff?text=Creative+Modern",
      previewImages: [
        "https://via.placeholder.com/800x600/ec4899/ffffff?text=Creative+Modern+Preview",
      ],
    },
    templateData: {
      html: "<div class='cv-template'>Creative Modern Template HTML</div>",
      css: ".cv-template { color: #ec4899; }",
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["creative", "modern", "design"],
      category: "creative",
      compatibility: ["modern browsers"],
    },
  },
  {
    name: "Minimal Clean",
    description: "A minimalist template focusing on content and readability",
    version: "1.0.0",
    isPremium: false,
    isActive: true,
    sections: {
      personalDetails: {
        enabled: true,
        layout: { position: "full", order: 1 },
        required: true,
      },
      experience: {
        enabled: true,
        layout: { position: "full", order: 2 },
        required: true,
      },
      education: {
        enabled: true,
        layout: { position: "full", order: 3 },
        required: true,
      },
      skills: {
        enabled: true,
        layout: { position: "full", order: 4 },
        required: true,
      },
      languages: {
        enabled: true,
        layout: { position: "full", order: 5 },
        required: false,
      },
      websites: {
        enabled: true,
        layout: { position: "full", order: 6 },
        required: false,
      },
      courses: {
        enabled: true,
        layout: { position: "full", order: 7 },
        required: false,
      },
    },
    styles: {
      primaryColor: "#374151",
      secondaryColor: "#6b7280",
      backgroundColor: "#ffffff",
      fontFamily: "Helvetica, Arial, sans-serif",
      fontSize: "12px",
      spacing: "1rem",
      borderRadius: "0px",
      boxShadow: "none",
    },
    preview: {
      thumbnail:
        "https://via.placeholder.com/400x300/374151/ffffff?text=Minimal+Clean",
      previewImages: [
        "https://via.placeholder.com/800x600/374151/ffffff?text=Minimal+Clean+Preview",
      ],
    },
    templateData: {
      html: "<div class='cv-template'>Minimal Clean Template HTML</div>",
      css: ".cv-template { color: #374151; }",
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["minimal", "clean", "simple"],
      category: "minimal",
      compatibility: ["all browsers"],
    },
  },
];

async function createSampleTemplates() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Template.deleteMany({});
    console.log("Cleared existing templates");

    const createdTemplates = await Template.insertMany(sampleTemplates);
    console.log(`Created ${createdTemplates.length} sample templates`);

    console.log("Sample templates created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating sample templates:", error);
    process.exit(1);
  }
}

createSampleTemplates();
