import mongoose from "mongoose";
import Template from "../src/models/template.model";
import dotenv from "dotenv";
import { generateTemplateThumbnail } from "../src/services/template-thumbnail.service";

dotenv.config();

const MONGODB_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/meta-cv";

// Define 6 new modern templates: 3 basic, 3 premium, all A4 size, with modern layouts and profile image support
const visualTemplates: any[] = [
  // BASIC 1: Minimalist Single Column
  {
    name: "Minimalist A4",
    description: "A clean, single-column A4 template for maximum readability.",
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
      projects: {
        enabled: true,
        layout: { position: "full", order: 6 },
        required: false,
      },
      certifications: {
        enabled: true,
        layout: { position: "full", order: 7 },
        required: false,
      },
      courses: {
        enabled: true,
        layout: { position: "full", order: 8 },
        required: false,
      },
      websites: {
        enabled: true,
        layout: { position: "full", order: 9 },
        required: false,
      },
    },
    styles: {
      primaryColor: "#22223b",
      secondaryColor: "#4a4e69",
      backgroundColor: "#fff",
      fontFamily: "Montserrat, Arial, sans-serif",
      fontSize: "15px",
      spacing: "1.5rem",
      borderRadius: "0px",
      boxShadow: "none",
    },
    preview: { thumbnail: "", previewImages: [] },
    templateData: {
      html: `<div class="cv-template minimalist-a4">
        <header>
          {{#if personalDetails.profileImage}}
            <img class="profile-img-large" src="{{personalDetails.profileImage}}" alt="Profile" />
          {{/if}}
          <h1>{{personalDetails.fullName}}</h1>
          <p>{{personalDetails.email}} | {{personalDetails.phone}}</p>
          <p>{{personalDetails.location}} | {{personalDetails.website}}</p>
          <p>{{personalDetails.linkedin}} | {{personalDetails.github}}</p>
          <p>{{personalDetails.summary}}</p>
        </header>
        <hr />
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
        </section>
        <hr />
        <section>
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
        </section>
        <hr />
        <section>
          <h2>Skills</h2>
          <ul>
            {{#each skills}}
              <li>{{name}} ({{level}})</li>
            {{/each}}
          </ul>
        </section>
        <hr />
        <section>
          <h2>Languages</h2>
          <ul>
            {{#each languages}}
              <li>{{name}} ({{proficiency}})</li>
            {{/each}}
          </ul>
        </section>
        <hr />
        <section>
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
        </section>
        <hr />
        <section>
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
      css: `.cv-template.minimalist-a4 { font-family: Montserrat, Arial, sans-serif; background: #fff; color: #22223b; width: 794px; min-height: 1123px; margin: 0 auto; padding: 48px 56px; box-sizing: border-box; }
.cv-template.minimalist-a4 header { text-align: center; margin-bottom: 24px; }
.cv-template.minimalist-a4 .profile-img-large { width: 180px; height: 180px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; border: 5px solid #fff !important; }
.cv-template.minimalist-a4 h1 { font-size: 2.5rem; color: #22223b; margin: 0; }
.cv-template.minimalist-a4 h2 { color: #4a4e69; margin-top: 32px; }
.cv-template.minimalist-a4 hr { border: none; border-top: 1px solid #4a4e69; margin: 32px 0; }`,
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["minimal", "a4", "basic", "single-column"],
      category: "basic",
      compatibility: ["modern browsers"],
    },
    defaultData: {
      title: "Minimalist A4 CV",
      personalDetails: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "+123456789",
        location: "New York, NY",
        website: "janedoe.com",
        linkedin: "linkedin.com/in/janedoe",
        github: "github.com/janedoe",
        summary:
          "Experienced professional with a focus on clarity and results.",
        profileImage: "",
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
          company: "TechCorp",
          position: "Lead Developer",
          startDate: "2019-01-01",
          endDate: "2023-01-01",
          description:
            "Led a team of 10 engineers to build scalable web applications.",
          location: "Remote",
          highlights: ["Built a scalable platform", "Mentored junior devs"],
        },
      ],
      skills: [
        { name: "JavaScript", level: "Expert" },
        { name: "React", level: "Advanced" },
        { name: "Node.js", level: "Advanced" },
      ],
      languages: [
        { name: "English", proficiency: "Native" },
        { name: "Spanish", proficiency: "Fluent" },
      ],
      projects: [
        {
          name: "Open Source Project",
          description:
            "A popular open source library used by thousands of developers.",
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
  // BASIC 2: Two Column
  {
    name: "Modern Two-Column",
    description:
      "A modern two-column A4 template for clear separation of info.",
    version: "1.0.0",
    isPremium: false,
    isActive: true,
    sections: {
      personalDetails: {
        enabled: true,
        layout: { position: "left", order: 1 },
        required: true,
      },
      skills: {
        enabled: true,
        layout: { position: "left", order: 2 },
        required: true,
      },
      languages: {
        enabled: true,
        layout: { position: "left", order: 3 },
        required: true,
      },
      experience: {
        enabled: true,
        layout: { position: "right", order: 4 },
        required: true,
      },
      education: {
        enabled: true,
        layout: { position: "right", order: 5 },
        required: true,
      },
      projects: {
        enabled: true,
        layout: { position: "right", order: 6 },
        required: false,
      },
      certifications: {
        enabled: true,
        layout: { position: "right", order: 7 },
        required: false,
      },
      courses: {
        enabled: true,
        layout: { position: "right", order: 8 },
        required: false,
      },
      websites: {
        enabled: true,
        layout: { position: "left", order: 9 },
        required: false,
      },
    },
    styles: {
      primaryColor: "#0a9396",
      secondaryColor: "#005f73",
      backgroundColor: "#fff",
      fontFamily: "Montserrat, Arial, sans-serif",
      fontSize: "15px",
      spacing: "1.5rem",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(10,147,150,0.10)",
    },
    preview: { thumbnail: "", previewImages: [] },
    templateData: {
      html: `<div class="cv-template two-col-a4">
        <div class="cv-columns">
          <aside class="cv-left">
            {{#if personalDetails.profileImage}}
              <img class="profile-img-large" src="{{personalDetails.profileImage}}" alt="Profile" />
            {{/if}}
            <h1>{{personalDetails.fullName}}</h1>
            <p>{{personalDetails.email}}</p>
            <p>{{personalDetails.phone}}</p>
            <p>{{personalDetails.location}}</p>
            <p>{{personalDetails.website}}</p>
            <p>{{personalDetails.linkedin}}</p>
            <p>{{personalDetails.github}}</p>
            <hr />
            <h2>Skills</h2>
            <ul>
              {{#each skills}}
                <li>{{name}} ({{level}})</li>
              {{/each}}
            </ul>
            <hr />
            <h2>Languages</h2>
            <ul>
              {{#each languages}}
                <li>{{name}} ({{proficiency}})</li>
              {{/each}}
            </ul>
          </aside>
          <main class="cv-right">
            <section>
              <h2>Profile</h2>
              <p>{{personalDetails.summary}}</p>
            </section>
            <hr />
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
            </section>
            <hr />
            <section>
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
            </section>
            <hr />
            <section>
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
            </section>
            <hr />
            <section>
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
          </main>
        </div>
      </div>`,
      css: `.cv-template.two-col-a4 { font-family: Montserrat, Arial, sans-serif; background: #fff; color: #0a9396; width: 794px; min-height: 1123px; margin: 0 auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(10,147,150,0.10); padding: 0; }
.cv-template.two-col-a4 .cv-columns { display: flex; min-height: 1123px; }
.cv-template.two-col-a4 .cv-left { background: #0a9396; color: #fff; width: 260px; padding: 40px 20px; border-radius: 8px 0 0 8px; display: flex; flex-direction: column; align-items: flex-start; }
.cv-template.two-col-a4 .cv-left h1 { color: #fff; font-size: 1.6rem; margin-bottom: 0.5rem; }
.cv-template.two-col-a4 .cv-left h2 { color: #e9d8a6; margin-top: 2rem; }
.cv-template.two-col-a4 .cv-left hr { border: none; border-top: 1px solid #e9d8a6; width: 100%; margin: 1.5rem 0; }
.cv-template.two-col-a4 .profile-img-large { width: 180px; height: 180px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; border: 5px solid #fff !important; }
.cv-template.two-col-a4 .cv-right { flex: 1; background: #fff; color: #0a9396; padding: 40px 32px; border-radius: 0 8px 8px 0; }
.cv-template.two-col-a4 .cv-right h2 { color: #005f73; margin-top: 0; }
.cv-template.two-col-a4 .cv-right hr { border: none; border-top: 1px solid #005f73; margin: 2rem 0; }
.cv-template.two-col-a4 section { margin-bottom: 2rem; }`,
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["two-column", "modern", "a4", "basic"],
      category: "basic",
      compatibility: ["modern browsers"],
    },
    defaultData: {
      title: "Modern Two-Column CV",
      personalDetails: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "+123456789",
        location: "New York, NY",
        website: "janedoe.com",
        linkedin: "linkedin.com/in/janedoe",
        github: "github.com/janedoe",
        summary: "Modern two-column layout for clear separation of info.",
        profileImage: "",
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
          company: "TechCorp",
          position: "Lead Developer",
          startDate: "2019-01-01",
          endDate: "2023-01-01",
          description:
            "Led a team of 10 engineers to build scalable web applications.",
          location: "Remote",
          highlights: ["Built a scalable platform", "Mentored junior devs"],
        },
      ],
      skills: [
        { name: "JavaScript", level: "Expert" },
        { name: "React", level: "Advanced" },
        { name: "Node.js", level: "Advanced" },
      ],
      languages: [
        { name: "English", proficiency: "Native" },
        { name: "Spanish", proficiency: "Fluent" },
      ],
      projects: [
        {
          name: "Open Source Project",
          description:
            "A popular open source library used by thousands of developers.",
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
  // BASIC 3: Simple Color Block
  {
    name: "Simple Color Block",
    description: "A basic A4 template with a colored header block.",
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
      projects: {
        enabled: true,
        layout: { position: "full", order: 6 },
        required: false,
      },
      certifications: {
        enabled: true,
        layout: { position: "full", order: 7 },
        required: false,
      },
      courses: {
        enabled: true,
        layout: { position: "full", order: 8 },
        required: false,
      },
      websites: {
        enabled: true,
        layout: { position: "full", order: 9 },
        required: false,
      },
    },
    styles: {
      primaryColor: "#f3722c",
      secondaryColor: "#f8961e",
      backgroundColor: "#fff",
      fontFamily: "Montserrat, Arial, sans-serif",
      fontSize: "15px",
      spacing: "1.5rem",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(243,114,44,0.10)",
    },
    preview: { thumbnail: "", previewImages: [] },
    templateData: {
      html: `<div class="cv-template colorblock-a4">
        <header class="header-block">
          {{#if personalDetails.profileImage}}
            <img class="profile-img-large" src="{{personalDetails.profileImage}}" alt="Profile" />
          {{/if}}
          <div class="header-info">
            <h1>{{personalDetails.fullName}}</h1>
            <p>{{personalDetails.email}} | {{personalDetails.phone}}</p>
            <p>{{personalDetails.location}} | {{personalDetails.website}}</p>
            <p>{{personalDetails.linkedin}} | {{personalDetails.github}}</p>
            <p>{{personalDetails.summary}}</p>
          </div>
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
        </section>
        <section>
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
        </section>
        <section>
          <h2>Skills</h2>
          <ul>
            {{#each skills}}
              <li>{{name}} ({{level}})</li>
            {{/each}}
          </ul>
        </section>
        <section>
          <h2>Languages</h2>
          <ul>
            {{#each languages}}
              <li>{{name}} ({{proficiency}})</li>
            {{/each}}
          </ul>
        </section>
        <section>
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
        </section>
        <section>
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
      css: `.cv-template.colorblock-a4 { font-family: Montserrat, Arial, sans-serif; background: #fff; color: #222; width: 794px; min-height: 1123px; margin: 0 auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(243,114,44,0.10); padding: 0; }
.cv-template.colorblock-a4 .header-block { background: #f3722c; color: #fff; display: flex; align-items: center; padding: 32px 40px; border-radius: 8px 8px 0 0; }
.cv-template.colorblock-a4 .profile-img-large { width: 180px; height: 180px; border-radius: 50%; object-fit: cover; margin-right: 32px; border: 5px solid #fff !important; }
.cv-template.colorblock-a4 .header-info { flex: 1; }
.cv-template.colorblock-a4 h1 { font-size: 2.2rem; color: #fff; margin: 0; }
.cv-template.colorblock-a4 h2 { color: #f3722c; margin-top: 32px; }
.cv-template.colorblock-a4 section { margin: 32px 40px; }`,
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["color block", "basic", "a4"],
      category: "basic",
      compatibility: ["modern browsers"],
    },
    defaultData: {
      title: "Simple Color Block CV",
      personalDetails: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "+123456789",
        location: "New York, NY",
        website: "janedoe.com",
        linkedin: "linkedin.com/in/janedoe",
        github: "github.com/janedoe",
        summary: "A basic template with a bold color block header.",
        profileImage: "",
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
          company: "TechCorp",
          position: "Lead Developer",
          startDate: "2019-01-01",
          endDate: "2023-01-01",
          description:
            "Led a team of 10 engineers to build scalable web applications.",
          location: "Remote",
          highlights: ["Built a scalable platform", "Mentored junior devs"],
        },
      ],
      skills: [
        { name: "JavaScript", level: "Expert" },
        { name: "React", level: "Advanced" },
        { name: "Node.js", level: "Advanced" },
      ],
      languages: [
        { name: "English", proficiency: "Native" },
        { name: "Spanish", proficiency: "Fluent" },
      ],
      projects: [
        {
          name: "Open Source Project",
          description:
            "A popular open source library used by thousands of developers.",
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
  // PREMIUM 1: Premium Big Image Top
  {
    name: "Premium Big Image Top",
    description:
      "Premium A4 template with a large profile image and bold header.",
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
      projects: {
        enabled: true,
        layout: { position: "full", order: 6 },
        required: false,
      },
      certifications: {
        enabled: true,
        layout: { position: "full", order: 7 },
        required: false,
      },
      courses: {
        enabled: true,
        layout: { position: "full", order: 8 },
        required: false,
      },
      websites: {
        enabled: true,
        layout: { position: "full", order: 9 },
        required: false,
      },
    },
    styles: {
      primaryColor: "#3a86ff",
      secondaryColor: "#8338ec",
      backgroundColor: "#fff",
      fontFamily: "Montserrat, Arial, sans-serif",
      fontSize: "16px",
      spacing: "2rem",
      borderRadius: "16px",
      boxShadow: "0 6px 24px rgba(58,134,255,0.10)",
    },
    preview: { thumbnail: "", previewImages: [] },
    templateData: {
      html: `<div class="cv-template premium-bigimg-a4">
        <header>
          {{#if personalDetails.profileImage}}
            <img class="profile-img-large" src="{{personalDetails.profileImage}}" alt="Profile" />
          {{/if}}
          <div class="header-content">
            <h1>{{personalDetails.fullName}}</h1>
            <p>{{personalDetails.email}} | {{personalDetails.phone}}</p>
            <p>{{personalDetails.location}} | {{personalDetails.website}}</p>
            <p>{{personalDetails.linkedin}} | {{personalDetails.github}}</p>
            <p>{{personalDetails.summary}}</p>
          </div>
        </header>
        <hr />
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
        </section>
        <hr />
        <section>
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
        </section>
        <hr />
        <section>
          <h2>Skills</h2>
          <ul>
            {{#each skills}}
              <li>{{name}} ({{level}})</li>
            {{/each}}
          </ul>
        </section>
        <hr />
        <section>
          <h2>Languages</h2>
          <ul>
            {{#each languages}}
              <li>{{name}} ({{proficiency}})</li>
            {{/each}}
          </ul>
        </section>
        <hr />
        <section>
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
        </section>
        <hr />
        <section>
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
      css: `.cv-template.premium-bigimg-a4 { font-family: Montserrat, Arial, sans-serif; background: #fff; color: #3a86ff; width: 794px; min-height: 1123px; margin: 0 auto; border-radius: 16px; box-shadow: 0 6px 24px rgba(58,134,255,0.10); padding: 0; }
.cv-template.premium-bigimg-a4 header { display: flex; align-items: center; margin-bottom: 32px; }
.cv-template.premium-bigimg-a4 .profile-img-large { width: 180px; height: 180px; border-radius: 50%; object-fit: cover; margin-right: 40px; border: 5px solid #fff !important; }
.cv-template.premium-bigimg-a4 .header-content { flex: 1; }
.cv-template.premium-bigimg-a4 h1 { font-size: 2.8rem; color: #3a86ff; margin: 0; }
.cv-template.premium-bigimg-a4 h2 { color: #8338ec; margin-top: 32px; }
.cv-template.premium-bigimg-a4 hr { border: none; border-top: 2px solid #3a86ff; margin: 32px 0; }`,
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["premium", "big image", "a4", "modern"],
      category: "premium",
      compatibility: ["modern browsers"],
    },
    defaultData: {
      title: "Premium Big Image Top CV",
      personalDetails: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "+123456789",
        location: "New York, NY",
        website: "janedoe.com",
        linkedin: "linkedin.com/in/janedoe",
        github: "github.com/janedoe",
        summary: "Premium template with a large profile image and bold header.",
        profileImage: "",
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
          company: "TechCorp",
          position: "Lead Developer",
          startDate: "2019-01-01",
          endDate: "2023-01-01",
          description:
            "Led a team of 10 engineers to build scalable web applications.",
          location: "Remote",
          highlights: ["Built a scalable platform", "Mentored junior devs"],
        },
      ],
      skills: [
        { name: "JavaScript", level: "Expert" },
        { name: "React", level: "Advanced" },
        { name: "Node.js", level: "Advanced" },
      ],
      languages: [
        { name: "English", proficiency: "Native" },
        { name: "Spanish", proficiency: "Fluent" },
      ],
      projects: [
        {
          name: "Open Source Project",
          description:
            "A popular open source library used by thousands of developers.",
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
  // PREMIUM 2: Premium Two Column Colorful
  {
    name: "Premium Colorful Split",
    description: "Premium two-column A4 template with vibrant color blocks.",
    version: "1.0.0",
    isPremium: true,
    isActive: true,
    sections: {
      personalDetails: {
        enabled: true,
        layout: { position: "left", order: 1 },
        required: true,
      },
      skills: {
        enabled: true,
        layout: { position: "left", order: 2 },
        required: true,
      },
      languages: {
        enabled: true,
        layout: { position: "left", order: 3 },
        required: true,
      },
      experience: {
        enabled: true,
        layout: { position: "right", order: 4 },
        required: true,
      },
      education: {
        enabled: true,
        layout: { position: "right", order: 5 },
        required: true,
      },
      projects: {
        enabled: true,
        layout: { position: "right", order: 6 },
        required: false,
      },
      certifications: {
        enabled: true,
        layout: { position: "right", order: 7 },
        required: false,
      },
      courses: {
        enabled: true,
        layout: { position: "right", order: 8 },
        required: false,
      },
      websites: {
        enabled: true,
        layout: { position: "left", order: 9 },
        required: false,
      },
    },
    styles: {
      primaryColor: "#ff006e",
      secondaryColor: "#8338ec",
      backgroundColor: "#fff",
      fontFamily: "Montserrat, Arial, sans-serif",
      fontSize: "16px",
      spacing: "2rem",
      borderRadius: "16px",
      boxShadow: "0 6px 24px rgba(255,0,110,0.10)",
    },
    preview: { thumbnail: "", previewImages: [] },
    templateData: {
      html: `<div class="cv-template premium-colorful-a4">
        <div class="cv-columns">
          <aside class="cv-left">
            {{#if personalDetails.profileImage}}
              <img class="profile-img-large" src="{{personalDetails.profileImage}}" alt="Profile" />
            {{/if}}
            <h1>{{personalDetails.fullName}}</h1>
            <p>{{personalDetails.email}}</p>
            <p>{{personalDetails.phone}}</p>
            <p>{{personalDetails.location}}</p>
            <p>{{personalDetails.website}}</p>
            <p>{{personalDetails.linkedin}}</p>
            <p>{{personalDetails.github}}</p>
            <hr />
            <h2>Skills</h2>
            <ul>
              {{#each skills}}
                <li>{{name}} ({{level}})</li>
              {{/each}}
            </ul>
            <hr />
            <h2>Languages</h2>
            <ul>
              {{#each languages}}
                <li>{{name}} ({{proficiency}})</li>
              {{/each}}
            </ul>
          </aside>
          <main class="cv-right">
            <section>
              <h2>Profile</h2>
              <p>{{personalDetails.summary}}</p>
            </section>
            <hr />
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
            </section>
            <hr />
            <section>
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
            </section>
            <hr />
            <section>
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
            </section>
            <hr />
            <section>
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
          </main>
        </div>
      </div>`,
      css: `.cv-template.premium-colorful-a4 { font-family: Montserrat, Arial, sans-serif; background: #fff; color: #ff006e; width: 794px; min-height: 1123px; margin: 0 auto; border-radius: 16px; box-shadow: 0 6px 24px rgba(255,0,110,0.10); padding: 0; }
.cv-template.premium-colorful-a4 .cv-columns { display: flex; min-height: 1123px; }
.cv-template.premium-colorful-a4 .cv-left { background: #ff006e; color: #fff; width: 260px; padding: 48px 24px; border-radius: 16px 0 0 16px; display: flex; flex-direction: column; align-items: flex-start; }
.cv-template.premium-colorful-a4 .cv-left h1 { color: #fff; font-size: 1.7rem; margin-bottom: 0.5rem; }
.cv-template.premium-colorful-a4 .cv-left h2 { color: #f1faee; margin-top: 2rem; }
.cv-template.premium-colorful-a4 .cv-left hr { border: none; border-top: 1px solid #f1faee; width: 100%; margin: 1.5rem 0; }
.cv-template.premium-colorful-a4 .profile-img-large { width: 180px; height: 180px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; border: 5px solid #fff !important; }
.cv-template.premium-colorful-a4 .cv-right { flex: 1; background: #fff; color: #ff006e; padding: 48px 40px; border-radius: 0 16px 16px 0; }
.cv-template.premium-colorful-a4 .cv-right h2 { color: #8338ec; margin-top: 0; }
.cv-template.premium-colorful-a4 .cv-right hr { border: none; border-top: 1px solid #8338ec; margin: 2rem 0; }
.cv-template.premium-colorful-a4 section { margin-bottom: 2rem; }`,
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["premium", "colorful", "split", "a4"],
      category: "premium",
      compatibility: ["modern browsers"],
    },
    defaultData: {
      title: "Premium Colorful Split CV",
      personalDetails: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "+123456789",
        location: "New York, NY",
        website: "janedoe.com",
        linkedin: "linkedin.com/in/janedoe",
        github: "github.com/janedoe",
        summary: "Premium two-column with vibrant color blocks.",
        profileImage: "",
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
          company: "TechCorp",
          position: "Lead Developer",
          startDate: "2019-01-01",
          endDate: "2023-01-01",
          description:
            "Led a team of 10 engineers to build scalable web applications.",
          location: "Remote",
          highlights: ["Built a scalable platform", "Mentored junior devs"],
        },
      ],
      skills: [
        { name: "JavaScript", level: "Expert" },
        { name: "React", level: "Advanced" },
        { name: "Node.js", level: "Advanced" },
      ],
      languages: [
        { name: "English", proficiency: "Native" },
        { name: "Spanish", proficiency: "Fluent" },
      ],
      projects: [
        {
          name: "Open Source Project",
          description:
            "A popular open source library used by thousands of developers.",
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
  // PREMIUM 3: Premium Elegant Dark
  {
    name: "Premium Elegant Dark",
    description: "Premium dark A4 template with elegant layout and contrast.",
    version: "1.0.0",
    isPremium: true,
    isActive: true,
    sections: {
      personalDetails: {
        enabled: true,
        layout: { position: "left", order: 1 },
        required: true,
      },
      skills: {
        enabled: true,
        layout: { position: "left", order: 2 },
        required: true,
      },
      languages: {
        enabled: true,
        layout: { position: "left", order: 3 },
        required: true,
      },
      experience: {
        enabled: true,
        layout: { position: "right", order: 4 },
        required: true,
      },
      education: {
        enabled: true,
        layout: { position: "right", order: 5 },
        required: true,
      },
      projects: {
        enabled: true,
        layout: { position: "right", order: 6 },
        required: false,
      },
      certifications: {
        enabled: true,
        layout: { position: "right", order: 7 },
        required: false,
      },
      courses: {
        enabled: true,
        layout: { position: "right", order: 8 },
        required: false,
      },
      websites: {
        enabled: true,
        layout: { position: "left", order: 9 },
        required: false,
      },
    },
    styles: {
      primaryColor: "#22223b",
      secondaryColor: "#f2e9e4",
      backgroundColor: "#fff",
      fontFamily: "Montserrat, Arial, sans-serif",
      fontSize: "16px",
      spacing: "2rem",
      borderRadius: "16px",
      boxShadow: "0 6px 24px rgba(34,34,59,0.10)",
    },
    preview: { thumbnail: "", previewImages: [] },
    templateData: {
      html: `<div class="cv-template premium-dark-a4">
        <div class="cv-columns">
          <aside class="cv-left">
            {{#if personalDetails.profileImage}}
              <img class="profile-img-large" src="{{personalDetails.profileImage}}" alt="Profile" />
            {{/if}}
            <h1>{{personalDetails.fullName}}</h1>
            <p>{{personalDetails.email}}</p>
            <p>{{personalDetails.phone}}</p>
            <p>{{personalDetails.location}}</p>
            <p>{{personalDetails.website}}</p>
            <p>{{personalDetails.linkedin}}</p>
            <p>{{personalDetails.github}}</p>
            <hr />
            <h2>Skills</h2>
            <ul>
              {{#each skills}}
                <li>{{name}} ({{level}})</li>
              {{/each}}
            </ul>
            <hr />
            <h2>Languages</h2>
            <ul>
              {{#each languages}}
                <li>{{name}} ({{proficiency}})</li>
              {{/each}}
            </ul>
          </aside>
          <main class="cv-right">
            <section>
              <h2>Profile</h2>
              <p>{{personalDetails.summary}}</p>
            </section>
            <hr />
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
            </section>
            <hr />
            <section>
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
            </section>
            <hr />
            <section>
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
            </section>
            <hr />
            <section>
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
          </main>
        </div>
      </div>`,
      css: `.cv-template.premium-dark-a4 { font-family: Montserrat, Arial, sans-serif; background: #fff; color: #f2e9e4; width: 794px; min-height: 1123px; margin: 0 auto; border-radius: 16px; box-shadow: 0 6px 24px rgba(34,34,59,0.10); padding: 0; }
.cv-template.premium-dark-a4 .cv-columns { display: flex; min-height: 1123px; }
.cv-template.premium-dark-a4 .cv-left { background: #22223b; color: #f2e9e4; width: 260px; padding: 48px 24px; border-radius: 16px 0 0 16px; display: flex; flex-direction: column; align-items: flex-start; }
.cv-template.premium-dark-a4 .cv-left h1 { color: #f2e9e4; font-size: 1.7rem; margin-bottom: 0.5rem; }
.cv-template.premium-dark-a4 .cv-left h2 { color: #f2e9e4; margin-top: 2rem; }
.cv-template.premium-dark-a4 .cv-left hr { border: none; border-top: 1px solid #f2e9e4; width: 100%; margin: 1.5rem 0; }
.cv-template.premium-dark-a4 .profile-img-large { width: 180px; height: 180px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; border: 5px solid #fff !important; }
.cv-template.premium-dark-a4 .cv-right { flex: 1; background: #fff; color: #f2e9e4; padding: 48px 40px; border-radius: 0 16px 16px 0; }
.cv-template.premium-dark-a4 .cv-right h2 { color: #f2e9e4; margin-top: 0; }
.cv-template.premium-dark-a4 .cv-right hr { border: none; border-top: 1px solid #f2e9e4; margin: 2rem 0; }
.cv-template.premium-dark-a4 section { margin-bottom: 2rem; }`,
    },
    metadata: {
      author: "MetaCV Team",
      tags: ["premium", "dark", "elegant", "a4"],
      category: "premium",
      compatibility: ["modern browsers"],
    },
    defaultData: {
      title: "Premium Elegant Dark CV",
      personalDetails: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "+123456789",
        location: "New York, NY",
        website: "janedoe.com",
        linkedin: "linkedin.com/in/janedoe",
        github: "github.com/janedoe",
        summary: "Premium dark template with elegant layout and contrast.",
        profileImage: "",
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
          company: "TechCorp",
          position: "Lead Developer",
          startDate: "2019-01-01",
          endDate: "2023-01-01",
          description:
            "Led a team of 10 engineers to build scalable web applications.",
          location: "Remote",
          highlights: ["Built a scalable platform", "Mentored junior devs"],
        },
      ],
      skills: [
        { name: "JavaScript", level: "Expert" },
        { name: "React", level: "Advanced" },
        { name: "Node.js", level: "Advanced" },
      ],
      languages: [
        { name: "English", proficiency: "Native" },
        { name: "Spanish", proficiency: "Fluent" },
      ],
      projects: [
        {
          name: "Open Source Project",
          description:
            "A popular open source library used by thousands of developers.",
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
