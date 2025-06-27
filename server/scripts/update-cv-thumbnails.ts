import CV from "../src/models/CV.model";
import Template from "../src/models/template.model";
import { generateCVThumbnail } from "../src/services/template-thumbnail.service";
import dotenv from "dotenv";
import { connectDB } from "../src/database";

dotenv.config();

async function updateAllCVThumbnails() {
  await connectDB();
  const cvs = await CV.find({});
  let updated = 0;
  for (const cv of cvs) {
    try {
      if (!cv.template) {
        console.log(`CV ${cv._id} has no template, skipping.`);
        continue;
      }
      const template = await Template.findById(cv.template);
      if (!template || !template.templateData || !template.templateData.html) {
        console.log(
          `CV ${cv._id} template not found or missing templateData, skipping.`
        );
        continue;
      }
      const thumbnail = await generateCVThumbnail(cv, template);
      cv.thumbnail = thumbnail;
      await cv.save();
      updated++;
      console.log(`Updated thumbnail for CV ${cv._id}`);
    } catch (err) {
      console.error(`Failed to update CV ${cv._id}:`, err);
    }
  }
  console.log(`Done. Updated ${updated} CV(s).`);
  process.exit(0);
}

updateAllCVThumbnails();
