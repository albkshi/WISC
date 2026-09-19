import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { initialDocuments, initialInvoices, initialActivities, initialMilestones, initialSettings } from "@/lib/initial-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialPayload = {
      documents: initialDocuments,
      invoices: initialInvoices,
      activities: initialActivities,
      milestones: initialMilestones,
      settings: initialSettings,
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialPayload, null, 2), "utf8");
    return initialPayload;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return {
      documents: initialDocuments,
      invoices: initialInvoices,
      activities: initialActivities,
      milestones: initialMilestones,
      settings: initialSettings,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export async function GET() {
  try {
    const data = ensureDbExists();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Storage GET error:", error);
    return NextResponse.json({
      documents: initialDocuments,
      invoices: initialInvoices,
      activities: initialActivities,
      milestones: initialMilestones,
      settings: initialSettings,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    ensureDbExists();
    
    // Save updated data
    const existing = ensureDbExists();
    const updated = {
      ...existing,
      ...payload,
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), "utf8");
    return NextResponse.json({ success: true, lastUpdated: updated.lastUpdated });
  } catch (error: unknown) {
    console.error("Storage POST error:", error);
    const msg = error instanceof Error ? error.message : "Failed to persist data";
    return NextResponse.json({ error: msg, success: false }, { status: 500 });
  }
}
