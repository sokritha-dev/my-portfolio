import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./sanity/schemaTypes";
import { dataset, projectId } from "./sanity/studio-env.generated";

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity project config. Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to .env.local, then run npm run sanity:dev.",
  );
}

export default defineConfig({
  name: "default",
  title: "Portfolio",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
