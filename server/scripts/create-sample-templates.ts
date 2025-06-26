import mongoose from "mongoose";
import Template from "../src/models/template.model";
import dotenv from "dotenv";
import { generateTemplateThumbnail } from "../src/services/template-thumbnail.service";

dotenv.config();

const MONGODB_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/meta-cv";

// Visually rich HTML/CSS for each template
const visualTemplates: any[] = [
  {
    name: "Professional Classic",
    description:
      "A clean and professional template perfect for corporate environments.",
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
        required: true,
      },
      websites: {
        enabled: true,
        layout: { position: "left", order: 6 },
        required: true,
      },
      courses: {
        enabled: true,
        layout: { position: "right", order: 7 },
        required: true,
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
      fontFamily: "Montserrat, Arial, sans-serif",
      fontSize: "14px",
      spacing: "1.5rem",
      borderRadius: "4px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    preview: {
      thumbnail: "",
      previewImages: [],
    },
    templateData: {
      html: `<div class="cv-template classic">
        <header>
          <h1>{{personalDetails.fullName}}</h1>
          <p>{{personalDetails.email}} | {{personalDetails.phone}}</p>
          <p>{{personalDetails.location}} | {{personalDetails.website}}</p>
          <p>{{personalDetails.linkedin}} | {{personalDetails.github}}</p>
          <p>{{personalDetails.summary}}</p>
        </header>
        <section>
          <h2>Experience</h2>
          <ul>
            {{#each experience}}
              <li>
                <strong>{{position}}</strong> at {{company}} ({{startDate}} - {{endDate}})
                <div>{{location}}</div>
                <div>{{description}}</div>
                <ul>
                  {{#each highlights}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
              </li>
            {{/each}}
          </ul>
          <h2>Education</h2>
          <ul>
            {{#each education}}
              <li>
                <strong>{{degree}}</strong> at {{institution}} ({{startDate}} - {{endDate}})
                <div>{{fieldOfStudy}}</div>
                <div>{{location}}</div>
                <div>{{description}}</div>
              </li>
            {{/each}}
          </ul>
          <h2>Skills</h2>
          <ul>
            {{#each skills}}
              <li>{{name}} ({{level}})</li>
            {{/each}}
          </ul>
          <h2>Languages</h2>
          <ul>
            {{#each languages}}
              <li>{{name}} ({{proficiency}})</li>
            {{/each}}
          </ul>
          <h2>Projects</h2>
          <ul>
            {{#each projects}}
              <li>
                <strong>{{name}}</strong> ({{startDate}} - {{endDate}})
                <div>{{description}}</div>
                <div>{{url}}</div>
                <ul>
                  {{#each technologies}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
                <ul>
                  {{#each highlights}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
              </li>
            {{/each}}
          </ul>
          <h2>Certifications</h2>
          <ul>
            {{#each certifications}}
              <li>
                <strong>{{name}}</strong> by {{issuer}} ({{date}})
                <div>{{credentialId}} | {{credentialUrl}}</div>
              </li>
            {{/each}}
          </ul>
        </section>
      </div>`,
      css: `.cv-template.classic { font-family: Montserrat, Arial, sans-serif; background: #fff; color: #222; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 32px; width: 700px; margin: 0 auto; }
.cv-template.classic header { border-bottom: 2px solid #2563eb; margin-bottom: 24px; }
.cv-template.classic h1 { color: #2563eb; margin: 0; }
.cv-template.classic .details { display: flex; gap: 32px; }
.cv-template.classic .left, .cv-template.classic .right { flex: 1; }
.cv-template.classic h2 { color: #1e40af; margin-top: 0; }`,
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["professional", "corporate", "clean"],
      category: "professional",
      compatibility: ["modern browsers"],
    },
    defaultData: {
      title: "Professional Classic CV",
      personalDetails: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "+123456789",
        location: "New York, NY",
        website: "janedoe.com",
        linkedin: "linkedin.com/in/janedoe",
        github: "github.com/janedoe",
        summary:
          "Experienced engineer with a passion for building scalable web apps.",
      },
      education: [
        {
          institution: "MIT",
          degree: "BSc Computer Science",
          fieldOfStudy: "Computer Science",
          startDate: "2015-09-01",
          endDate: "2019-06-01",
          description: "Graduated with honors.",
          location: "Cambridge, MA",
        },
      ],
      experience: [
        {
          company: "TechCorp",
          position: "Lead Developer",
          startDate: "2019-01-01",
          endDate: "2023-01-01",
          description: "Led a team of 10 engineers.",
          location: "Remote",
          highlights: ["Built a scalable platform", "Mentored junior devs"],
        },
      ],
      skills: [
        { name: "JavaScript", level: "Expert" },
        { name: "React", level: "Advanced" },
      ],
      languages: [
        { name: "English", proficiency: "Native" },
        { name: "Spanish", proficiency: "Fluent" },
      ],
      projects: [
        {
          name: "Open Source Project",
          description: "A popular open source library.",
          startDate: "2020-01-01",
          endDate: "2021-01-01",
          url: "github.com/janedoe/opensource",
          technologies: ["React", "Node.js"],
          highlights: ["1000+ stars", "Used by Fortune 500 companies"],
        },
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon",
          date: "2022-01-01",
          expiryDate: "2025-01-01",
          credentialId: "ABC123",
          credentialUrl: "aws.amazon.com/cert/abc123",
        },
      ],
      isPublic: true,
    },
  },
  {
    name: "Creative Modern",
    description:
      "A bold and creative template for designers and creative professionals.",
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
        required: true,
      },
      websites: {
        enabled: true,
        layout: { position: "left", order: 6 },
        required: true,
      },
      courses: {
        enabled: true,
        layout: { position: "right", order: 7 },
        required: true,
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
    },
    styles: {
      primaryColor: "#ec4899",
      secondaryColor: "#be185d",
      backgroundColor: "#fdf2f8",
      fontFamily: "Montserrat, Georgia, serif",
      fontSize: "16px",
      spacing: "2rem",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    preview: {
      thumbnail: "",
      previewImages: [],
    },
    templateData: {
      html: `<div class="cv-template modern">
        <header>
          <h1>{{personalDetails.fullName}}</h1>
          <p>{{personalDetails.email}} | {{personalDetails.phone}}</p>
          <p>{{personalDetails.location}} | {{personalDetails.website}}</p>
          <p>{{personalDetails.linkedin}} | {{personalDetails.github}}</p>
          <p>{{personalDetails.summary}}</p>
        </header>
        <section>
          <h2>Experience</h2>
          <ul>
            {{#each experience}}
              <li>
                <strong>{{position}}</strong> at {{company}} ({{startDate}} - {{endDate}})
                <div>{{location}}</div>
                <div>{{description}}</div>
                <ul>
                  {{#each highlights}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
              </li>
            {{/each}}
          </ul>
          <h2>Education</h2>
          <ul>
            {{#each education}}
              <li>
                <strong>{{degree}}</strong> at {{institution}} ({{startDate}} - {{endDate}})
                <div>{{fieldOfStudy}}</div>
                <div>{{location}}</div>
                <div>{{description}}</div>
              </li>
            {{/each}}
          </ul>
          <h2>Skills</h2>
          <ul>
            {{#each skills}}
              <li>{{name}} ({{level}})</li>
            {{/each}}
          </ul>
          <h2>Languages</h2>
          <ul>
            {{#each languages}}
              <li>{{name}} ({{proficiency}})</li>
            {{/each}}
          </ul>
          <h2>Projects</h2>
          <ul>
            {{#each projects}}
              <li>
                <strong>{{name}}</strong> ({{startDate}} - {{endDate}})
                <div>{{description}}</div>
                <div>{{url}}</div>
                <ul>
                  {{#each technologies}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
                <ul>
                  {{#each highlights}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
              </li>
            {{/each}}
          </ul>
          <h2>Certifications</h2>
          <ul>
            {{#each certifications}}
              <li>
                <strong>{{name}}</strong> by {{issuer}} ({{date}})
                <div>{{credentialId}} | {{credentialUrl}}</div>
              </li>
            {{/each}}
          </ul>
        </section>
      </div>`,
      css: `.cv-template.modern { font-family: Montserrat, Georgia, serif; background: #fdf2f8; color: #222; border-radius: 16px; box-shadow: 0 4px 6px rgba(236,72,153,0.15); padding: 40px; width: 700px; margin: 0 auto; }
.cv-template.modern header { border-bottom: 3px solid #ec4899; margin-bottom: 24px; }
.cv-template.modern h1 { color: #ec4899; margin: 0; }
.cv-template.modern .main { display: flex; gap: 32px; }
.cv-template.modern .left, .cv-template.modern .right { flex: 1; }
.cv-template.modern h2 { color: #be185d; margin-top: 0; }
.cv-template.modern .skills { margin-top: 32px; }`,
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["creative", "modern", "design"],
      category: "creative",
      compatibility: ["modern browsers"],
    },
    defaultData: {
      title: "Creative Modern CV",
      personalDetails: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "+123456789",
        location: "New York, NY",
        website: "janedoe.com",
        linkedin: "linkedin.com/in/janedoe",
        github: "github.com/janedoe",
        summary:
          "Experienced designer with a passion for creating beautiful user experiences.",
      },
      education: [
        {
          institution: "RISD",
          degree: "BFA in Graphic Design",
          fieldOfStudy: "Graphic Design",
          startDate: "2015-09-01",
          endDate: "2019-05-01",
          description: "Graduated with honors.",
          location: "Providence, RI",
        },
      ],
      experience: [
        {
          company: "Studio X",
          position: "Lead Designer",
          startDate: "2019-01-01",
          endDate: "2023-01-01",
          description: "Led a team of 5 designers.",
          location: "New York, NY",
          highlights: [
            "Designed award-winning campaigns",
            "Managed a team of 5 designers",
          ],
        },
      ],
      skills: [
        { name: "Figma", level: "Expert" },
        { name: "Photoshop", level: "Expert" },
        { name: "Illustrator", level: "Advanced" },
        { name: "InDesign", level: "Advanced" },
      ],
      languages: [
        { name: "English", proficiency: "Native" },
        { name: "Spanish", proficiency: "Fluent" },
      ],
      projects: [
        {
          name: "Brand Identity for TechCorp",
          description:
            "Designed a comprehensive brand identity for a tech startup.",
          startDate: "2020-01-01",
          endDate: "2020-06-01",
          url: "janedoe.com/techcorp",
          technologies: ["Figma", "Illustrator"],
          highlights: ["Award-winning design", "Used by TechCorp"],
        },
      ],
      certifications: [
        {
          name: "Adobe Certified Expert in Graphic Design",
          issuer: "Adobe",
          date: "2022-01-01",
          expiryDate: "2025-01-01",
          credentialId: "ABC123",
          credentialUrl: "adobe.com/cert/abc123",
        },
      ],
      isPublic: true,
    },
  },
  {
    name: "Minimal Clean",
    description: "A minimalist template focusing on content and readability.",
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
        required: true,
      },
      websites: {
        enabled: true,
        layout: { position: "full", order: 6 },
        required: true,
      },
      courses: {
        enabled: true,
        layout: { position: "full", order: 7 },
        required: true,
      },
      projects: {
        enabled: true,
        layout: { position: "full", order: 8 },
        required: false,
      },
      certifications: {
        enabled: true,
        layout: { position: "full", order: 9 },
        required: false,
      },
    },
    styles: {
      primaryColor: "#374151",
      secondaryColor: "#6b7280",
      backgroundColor: "#ffffff",
      fontFamily: "Montserrat, Helvetica, Arial, sans-serif",
      fontSize: "12px",
      spacing: "1rem",
      borderRadius: "0px",
      boxShadow: "none",
    },
    preview: {
      thumbnail: "",
      previewImages: [],
    },
    templateData: {
      html: `<div class="cv-template minimal">
        <header>
          <h1>{{personalDetails.fullName}}</h1>
          <p>{{personalDetails.email}} | {{personalDetails.phone}}</p>
          <p>{{personalDetails.location}} | {{personalDetails.website}}</p>
          <p>{{personalDetails.linkedin}} | {{personalDetails.github}}</p>
          <p>{{personalDetails.summary}}</p>
        </header>
        <section>
          <h2>Experience</h2>
          <ul>
            {{#each experience}}
              <li>
                <strong>{{position}}</strong> at {{company}} ({{startDate}} - {{endDate}})
                <div>{{location}}</div>
                <div>{{description}}</div>
                <ul>
                  {{#each highlights}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
              </li>
            {{/each}}
          </ul>
          <h2>Education</h2>
          <ul>
            {{#each education}}
              <li>
                <strong>{{degree}}</strong> at {{institution}} ({{startDate}} - {{endDate}})
                <div>{{fieldOfStudy}}</div>
                <div>{{location}}</div>
                <div>{{description}}</div>
              </li>
            {{/each}}
          </ul>
          <h2>Skills</h2>
          <ul>
            {{#each skills}}
              <li>{{name}} ({{level}})</li>
            {{/each}}
          </ul>
          <h2>Languages</h2>
          <ul>
            {{#each languages}}
              <li>{{name}} ({{proficiency}})</li>
            {{/each}}
          </ul>
          <h2>Projects</h2>
          <ul>
            {{#each projects}}
              <li>
                <strong>{{name}}</strong> ({{startDate}} - {{endDate}})
                <div>{{description}}</div>
                <div>{{url}}</div>
                <ul>
                  {{#each technologies}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
                <ul>
                  {{#each highlights}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
              </li>
            {{/each}}
          </ul>
          <h2>Certifications</h2>
          <ul>
            {{#each certifications}}
              <li>
                <strong>{{name}}</strong> by {{issuer}} ({{date}})
                <div>{{credentialId}} | {{credentialUrl}}</div>
              </li>
            {{/each}}
          </ul>
        </section>
      </div>`,
      css: `.cv-template.minimal { font-family: Montserrat, Helvetica, Arial, sans-serif; background: #fff; color: #222; border-radius: 0; box-shadow: none; padding: 32px; width: 700px; margin: 0 auto; }
.cv-template.minimal header { border-bottom: 1px solid #374151; margin-bottom: 16px; }
.cv-template.minimal h1 { color: #374151; margin: 0; }
.cv-template.minimal h2 { color: #6b7280; margin-top: 24px; }`,
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["minimal", "clean", "simple"],
      category: "minimal",
      compatibility: ["all browsers"],
    },
    defaultData: {
      title: "Minimal Clean CV",
      personalDetails: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "+123456789",
        location: "New York, NY",
        website: "janedoe.com",
        linkedin: "linkedin.com/in/janedoe",
        github: "github.com/janedoe",
        summary:
          "Experienced developer with a passion for building scalable web apps.",
      },
      education: [
        {
          institution: "Harvard University",
          degree: "BA in Computer Science",
          fieldOfStudy: "Computer Science",
          startDate: "2015-09-01",
          endDate: "2019-06-01",
          description: "Graduated with honors.",
          location: "Cambridge, MA",
        },
      ],
      experience: [
        {
          company: "Company Z",
          position: "Software Developer",
          startDate: "2019-01-01",
          endDate: "2023-01-01",
          description: "Led a team of 10 engineers.",
          location: "Remote",
          highlights: ["Built a scalable platform", "Mentored junior devs"],
        },
      ],
      skills: [
        { name: "Python", level: "Expert" },
        { name: "Vue.js", level: "Advanced" },
      ],
      languages: [
        { name: "English", proficiency: "Native" },
        { name: "Spanish", proficiency: "Fluent" },
      ],
      projects: [
        {
          name: "Open Source Project",
          description: "A popular open source library.",
          startDate: "2020-01-01",
          endDate: "2021-01-01",
          url: "github.com/janedoe/opensource",
          technologies: ["Python", "Vue.js"],
          highlights: ["1000+ stars", "Used by Fortune 500 companies"],
        },
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon",
          date: "2022-01-01",
          expiryDate: "2025-01-01",
          credentialId: "ABC123",
          credentialUrl: "aws.amazon.com/cert/abc123",
        },
      ],
      isPublic: true,
    },
  },
  {
    name: "Elegant Dark",
    description: "A sophisticated dark theme for modern professionals.",
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
        layout: { position: "left", order: 4 },
        required: true,
      },
      languages: {
        enabled: true,
        layout: { position: "right", order: 5 },
        required: true,
      },
      websites: {
        enabled: true,
        layout: { position: "left", order: 6 },
        required: true,
      },
      courses: {
        enabled: true,
        layout: { position: "right", order: 7 },
        required: true,
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
    },
    styles: {
      primaryColor: "#0f172a",
      secondaryColor: "#38bdf8",
      backgroundColor: "#18181b",
      fontFamily: "Montserrat, Arial, sans-serif",
      fontSize: "15px",
      spacing: "1.5rem",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(56,189,248,0.15)",
    },
    preview: {
      thumbnail: "",
      previewImages: [],
    },
    templateData: {
      html: `<div class="cv-template dark">
        <header>
          <h1>{{personalDetails.fullName}}</h1>
          <p>{{personalDetails.email}} | {{personalDetails.phone}}</p>
          <p>{{personalDetails.location}} | {{personalDetails.website}}</p>
          <p>{{personalDetails.linkedin}} | {{personalDetails.github}}</p>
          <p>{{personalDetails.summary}}</p>
        </header>
        <section>
          <h2>Experience</h2>
          <ul>
            {{#each experience}}
              <li>
                <strong>{{position}}</strong> at {{company}} ({{startDate}} - {{endDate}})
                <div>{{location}}</div>
                <div>{{description}}</div>
                <ul>
                  {{#each highlights}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
              </li>
            {{/each}}
          </ul>
          <h2>Education</h2>
          <ul>
            {{#each education}}
              <li>
                <strong>{{degree}}</strong> at {{institution}} ({{startDate}} - {{endDate}})
                <div>{{fieldOfStudy}}</div>
                <div>{{location}}</div>
                <div>{{description}}</div>
              </li>
            {{/each}}
          </ul>
          <h2>Skills</h2>
          <ul>
            {{#each skills}}
              <li>{{name}} ({{level}})</li>
            {{/each}}
          </ul>
          <h2>Languages</h2>
          <ul>
            {{#each languages}}
              <li>{{name}} ({{proficiency}})</li>
            {{/each}}
          </ul>
          <h2>Projects</h2>
          <ul>
            {{#each projects}}
              <li>
                <strong>{{name}}</strong> ({{startDate}} - {{endDate}})
                <div>{{description}}</div>
                <div>{{url}}</div>
                <ul>
                  {{#each technologies}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
                <ul>
                  {{#each highlights}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
              </li>
            {{/each}}
          </ul>
          <h2>Certifications</h2>
          <ul>
            {{#each certifications}}
              <li>
                <strong>{{name}}</strong> by {{issuer}} ({{date}})
                <div>{{credentialId}} | {{credentialUrl}}</div>
              </li>
            {{/each}}
          </ul>
        </section>
      </div>`,
      css: `.cv-template.dark { font-family: Montserrat, Arial, sans-serif; background: #18181b; color: #f1f5f9; border-radius: 12px; box-shadow: 0 2px 8px rgba(56,189,248,0.15); padding: 40px; width: 700px; margin: 0 auto; }
.cv-template.dark header { border-bottom: 2px solid #38bdf8; margin-bottom: 24px; }
.cv-template.dark h1 { color: #38bdf8; margin: 0; }
.cv-template.dark .main { display: flex; gap: 32px; }
.cv-template.dark .left, .cv-template.dark .right { flex: 1; }
.cv-template.dark h2 { color: #38bdf8; margin-top: 0; }`,
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["dark", "elegant", "modern"],
      category: "dark",
      compatibility: ["modern browsers"],
    },
    defaultData: {
      title: "Elegant Dark CV",
      personalDetails: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "+123456789",
        location: "New York, NY",
        website: "janedoe.com",
        linkedin: "linkedin.com/in/janedoe",
        github: "github.com/janedoe",
        summary:
          "Experienced data scientist with a passion for building scalable web apps.",
      },
      education: [
        {
          institution: "Stanford University",
          degree: "MSc in Artificial Intelligence",
          fieldOfStudy: "Artificial Intelligence",
          startDate: "2019-09-01",
          endDate: "2021-06-01",
          description: "Graduated with honors.",
          location: "Stanford, CA",
        },
      ],
      experience: [
        {
          company: "DeepAI",
          position: "Data Scientist",
          startDate: "2021-07-01",
          endDate: "2023-01-01",
          description: "Led a team of 10 data scientists.",
          location: "Remote",
          highlights: [
            "Built a scalable platform",
            "Mentored junior data scientists",
          ],
        },
      ],
      skills: [
        { name: "Python", level: "Expert" },
        { name: "TensorFlow", level: "Expert" },
      ],
      languages: [
        { name: "English", proficiency: "Native" },
        { name: "German", proficiency: "Fluent" },
      ],
      projects: [
        {
          name: "Open Source Project",
          description: "A popular open source library.",
          startDate: "2020-01-01",
          endDate: "2021-01-01",
          url: "github.com/janedoe/opensource",
          technologies: ["Python", "TensorFlow"],
          highlights: ["1000+ stars", "Used by Fortune 500 companies"],
        },
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon",
          date: "2022-01-01",
          expiryDate: "2025-01-01",
          credentialId: "ABC123",
          credentialUrl: "aws.amazon.com/cert/abc123",
        },
      ],
      isPublic: true,
    },
  },
];

async function createVisualTemplates() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Template.deleteMany({});
    console.log("Cleared existing templates");

    for (const template of visualTemplates as any[]) {
      // Generate thumbnail from HTML/CSS
      const thumbnail = await generateTemplateThumbnail(
        template.templateData.html,
        template.templateData.css
      );
      template.preview.thumbnail = thumbnail;
      template.preview.previewImages = [thumbnail];
      await Template.create(template);
      console.log(`Created template: ${template.name}`);
    }

    console.log("Visual templates created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating visual templates:", error);
    process.exit(1);
  }
}

createVisualTemplates();
