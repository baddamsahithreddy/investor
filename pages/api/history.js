import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "data", "history.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const history = JSON.parse(fileData);
    res.status(200).json(history);
  } catch (error) {
    console.error("Failed to load history:", error);
    res.status(500).json({ error: "Failed to fetch history data" });
  }
}
