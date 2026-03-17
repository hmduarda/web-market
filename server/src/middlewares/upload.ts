import { Request, Response, NextFunction } from "express";
import { upload } from "../config/multer";

export const uploadSingle = upload.single("image");

export const handleUploadError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};
