// import multer from "multer";
// import path from "path";
// import fs from "fs";

// export const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadPath = path.join(__dirname, "../uploads");
//       if (!fs.existsSync(uploadPath)) {
//         fs.mkdirSync(uploadPath);
//       }
//       cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = `${Date.now()}-${Math.round(
//         Math.random() * 1e9
//       )}${path.extname(file.originalname)}`;
//       cb(null, uniqueSuffix);
//     },
//   }),
// });
