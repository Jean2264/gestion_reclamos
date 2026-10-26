import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    files: 2,
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
