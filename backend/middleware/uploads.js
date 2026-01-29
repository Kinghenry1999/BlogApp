import path from "path"
import multer from "multer"



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/posts");
  },
  filename: (req, file, cb) => {
    const uniqueName = 
    Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

// const upload = multer({ storage: storage })