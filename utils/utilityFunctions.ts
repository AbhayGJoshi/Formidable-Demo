import fs from "fs";
import path from "path";

const prepareDir = (): string => {
  const uploadDir = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  return uploadDir;
};

const fname = (ext: string, originalFilename: string): string => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  const filename = path.parse(originalFilename).name || "";
  return filename + `_${day}${month}${year}_${hours}${minutes}${seconds}${ext}`;
};

export { prepareDir, fname };
