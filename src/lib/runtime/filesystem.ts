import fs from "fs";
import path from "path";

export function isServerlessDeploy(): boolean {
  return process.env.VERCEL === "1" || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
}

/** True when the app can create files under `data/<subdir>` (local dev). False on Vercel. */
export function canWriteUnderData(subdir: string): boolean {
  if (isServerlessDeploy()) return false;
  const dir = path.join(process.cwd(), "data", subdir);
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export function canWritePublicMedia(): boolean {
  if (isServerlessDeploy()) return false;
  const dir = path.join(process.cwd(), "public", "course-media");
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export function supabaseRequiredForUploadsMessage(): string {
  return (
    "File uploads on the live site use Supabase Storage, not disk. " +
    "Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in Vercel, " +
    "run npm run setup:supabase once (creates the course-marketing bucket), then redeploy."
  );
}
