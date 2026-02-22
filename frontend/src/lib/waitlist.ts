import { promises as fs } from "fs";
import path from "path";

export interface WaitlistEntry {
  email: string;
  role: "buyer" | "seller";
  timestamp: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

async function readEntries(): Promise<WaitlistEntry[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeEntries(entries: WaitlistEntry[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
}

export async function addToWaitlist(
  email: string,
  role: "buyer" | "seller"
): Promise<{ success: boolean; message: string }> {
  const entries = await readEntries();

  const exists = entries.some(
    (entry) => entry.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    return { success: false, message: "This email is already on the waitlist." };
  }

  entries.push({
    email: email.toLowerCase().trim(),
    role,
    timestamp: new Date().toISOString(),
  });

  await writeEntries(entries);

  return {
    success: true,
    message: "Welcome aboard! You'll be the first to know when PappoCrafts launches.",
  };
}
