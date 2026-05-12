import express from "express"
import { upload } from "../config/multer.js";
import { register } from "../controllers/userController.js";
// import userAuth from "../middleware/userAuth.js";


const userRouter = express.Router();

userRouter.post("/register", upload.single("file"), register)

export default userRouter