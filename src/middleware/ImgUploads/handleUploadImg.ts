import { UploadedFile } from "express-fileupload";
import path from "path";
import { projectRoot } from "../../app";

export default function handleUploadImg(
  uploadedFile: UploadedFile | UploadedFile[] | undefined
): string | undefined {
  if (!uploadedFile) return;

  if (uploadedFile instanceof Array) return;

  const fileName = `${Date.now()}-${uploadedFile.name}`;
  const uploadPath = projectRoot + "\\uploads\\profile\\" + fileName;
  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return;
    }
  });
  const imageUrl = `\\uploads\\profile\\${path.basename(uploadPath)}`;

  return imageUrl;
}
