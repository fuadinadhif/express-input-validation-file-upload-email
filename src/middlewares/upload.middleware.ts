import multer from "multer";
import path from "node:path";

export const upload = multer({
  storage: multer.diskStorage({
    destination: (request, file, cb) => {
      return cb(null, "public");
    },
    filename: (request, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (request, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;
    const extName = path.extname(file.originalname);
    const isTypeValid = allowedTypes.test(extName);

    if (isTypeValid) {
      return cb(null, true);
    } else {
      return cb(new Error("Only image files are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});
