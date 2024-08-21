import { projectRoot } from "../../app";
import fs from "fs/promises";

export default async function handleDeleteImg(
  imgName: string
): Promise<boolean> {
  const imgPath = projectRoot + imgName;
  try {
    // Check if the file exists
    await fs.access(imgPath);

    // Delete the file
    await fs.unlink(imgPath);

    return true; // File successfully deleted
  } catch (err) {
    return true; // File does not exist or could not be deleted
  }
}
