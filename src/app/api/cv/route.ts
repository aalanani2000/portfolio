import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";

const PDF_PATH = join(process.cwd(), "public", "cv", "Abdulrahman-Alanani-CV.pdf");

export async function GET() {
  try {
    const data = await readFile(PDF_PATH);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(data.byteLength),
        "Content-Disposition":
          'attachment; filename="Abdulrahman-Alanani-CV.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("CV file not found", { status: 404 });
  }
}
