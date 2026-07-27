import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env"));

function aliasStudioEnv(studioKey: string, publicKey: string) {
  if (!process.env[studioKey] && process.env[publicKey]) {
    process.env[studioKey] = process.env[publicKey];
  }
}

aliasStudioEnv("SANITY_STUDIO_PROJECT_ID", "NEXT_PUBLIC_SANITY_PROJECT_ID");
aliasStudioEnv("SANITY_STUDIO_DATASET", "NEXT_PUBLIC_SANITY_DATASET");
aliasStudioEnv("SANITY_STUDIO_API_VERSION", "NEXT_PUBLIC_SANITY_API_VERSION");
