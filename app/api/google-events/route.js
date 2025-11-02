import fs from "fs";
import path from "path";

export async function GET() {
  const dataPath = path.resolve(process.cwd(), "data", "events.json");
  if (!fs.existsSync(dataPath)) {
    return new Response(JSON.stringify({ error: "No events data found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  const body = fs.readFileSync(dataPath, "utf8");
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
