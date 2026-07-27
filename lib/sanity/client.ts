import { createClient } from "@sanity/client";

import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

export { isSanityConfigured };

export const sanityClient = createClient({
  projectId: projectId || "missing-project-id",
  dataset: dataset || "production",
  apiVersion,
  useCdn: false,
});
