import express from "express"
import { upload } from "../config/multer.js";
import { createProduct } from "../controllers/productController.js";


const productRouter = express.Router();

productRouter.post("/create-product", upload.array("images"), createProduct)

export default productRouter